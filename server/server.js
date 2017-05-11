/**
 * FIXME: do we need to sanitize anything?
 */
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const app = express();
const bodyParser = require('body-parser');

const DB_NAME = "recipes";
var db;
var url = 'mongodb://localhost:27017/recipes';
MongoClient.connect(url, function(err, dbc) {
  if( err){
    console.log( "mongo connect error:", err);
  }
  db = dbc;
});


app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

/* pass mongo down
app.use(function(req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('tasks');
  next();
});
*/
app.use( bodyParser.json());

app.get( '/api/recipes', (req, res) => {
  db.collection( 'recipes').find( { deleteme : { $exists : false}}).sort( { name: 1})
  .toArray( function( err, items){
    res.json( items);
  });
});

app.post( '/api/recipes', (req, res) => {
  const list = req.body;
  let promises = [];
  list.forEach( ( recipe) => {
    if( typeof recipe._id === "undefined") recipe._id = 0;
    delete recipe.dirty; // clean now
    delete recipe.id; // local id is no use
    console.log( "***********recipe:", recipe);
    const p =  new Promise( (resolve, reject) => {
      db.collection( 'recipes').findOneAndReplace(
        { _id : ObjectId( recipe._id)},
        { name : recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        },
        { projection: { _id, name, ingredients, instructions},
          returnOriginal: false,
          upsert: true
        }
      )
      .then( (result) => {
        console.log( "udpate recipe result:", result);
        resolve( result.value);
      })
      .catch( (error) => {
        console.log( "recipe update failed:", error);
        reject( error);
      });
    });
    promises.push( p);
  });
  console.log( `processing [${promises.length}]`);
  Promise.all( promises).then(( results) => {
    console.log( "post recipes all promises results:", results);
    res.json( results);
  });
});

// app.delete( '/api/recipes', (req, res) => {
//   const list = req.body;
//   const idlist = list.map( ( item) => { return ObjectId(item._id);});
//   db.collection( 'recipes').deleteMany(
//     { _id : { $in : idlist}}
//   )
//   .then( res.json( results));
// });

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
