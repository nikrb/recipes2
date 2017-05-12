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

console.log( `using port [${process.env.PORT}] env [${process.env.NODE_ENV}]`);
app.set('port', (process.env.PORT || 8081));

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
    delete recipe.dirty; // clean now
    if( typeof recipe._id === "undefined" || recipe._id === ""){
      console.log( "insert new recipe:", recipe);
      const p = new Promise( (resolve, reject) => {
        db.collection( 'recipes').insertOne( recipe)
        .then( (result) => {
          resolve( result);
        })
      });
      promises.push( p);
    } else {
      console.log( "replace recipe:", recipe);
      const p = new Promise( (resolve, reject) => {
        // we can't provide the _id field or mongo tries to change it
        // even if the same and we get an error
        const recipe_id = recipe._id;
        delete recipe._id;
        db.collection( 'recipes').findOneAndReplace(
          { _id: ObjectId( recipe_id)},
          recipe
        )
        .then( (result) => {
          // console.log( "udpate recipe result:", result);
          resolve( result.value);
        })
        .catch( (error) => {
          console.error( "recipe update failed:", error);
          reject( error);
        });
      });
      promises.push( p);
    }
  });
  Promise.all( promises).then(( results) => {
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
