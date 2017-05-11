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
// TODO: remove testing
// app.get( '/api/recipes', ( req, res) => {
//   const {name} = req.query;
//   console.log( `got name [${name}]`);
//   let promises = [];
//   let query_col = { name: name};
//   const p = new Promise( (resolve, reject) => {
//     db.collection( 'recipes').findOneAndUpdate(
//       query_col,
//       { name: name, instructions: "testing5"},
//       { projection: { _id:1, name:1, instructions:1},
//         upsert: true,
//         returnOriginal: false
//       }
//     ).then( (result) => {
//       console.log( "results:", result.value);
//       resolve( result.value);
//     }).catch( (error) => {
//       console.log( "error:", error);
//       reject( "failed");
//     });
//   });
//   promises.push( p);
//   Promise.all( promises).then( (results) => {
//     console.log( "finished results:", results);
//     res.send( results);
//   })
// });

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
      const p =  new Promise( (resolve, reject) => {
        db.collection( 'recipes').findOneAndReplace(
          { _id: ObjectId( recipe._id)},
          { created: recipe.created,
            name : recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
          },
          { projection: { _id:1, created:1, name:1, ingredients:1, instructions:1},
            returnOriginal: false
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
