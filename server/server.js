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
  db.collection( 'recipes').find().sort( { created: -1})
  .toArray( function( err, items){
    res.json( items);
  });
});

app.post( '/api/recipes', (req, res) => {
  const list = req.body;
  let promises = [];
  list.forEach( ( recipe) => {
    const p =  new Promise( (resolve, reject) => {
      db.collection( 'recipes').findOneAndReplace(
        { _id : ObjectId( recipe._id)},
        { recipe},
        { upsert: true}
      )
      .then( resolve( result));
    });
    promses.push( p);
  });
  Promises.all( ( results) => {
    res.json( results);
  });
});

app.delete( '/api/recipes', (req, res) => {
  const list = req.body;
  const idlist = list.map( ( item) => { return ObjectId(item._id);});
  db.collection( 'recipes').deleteMany(
    { _id : { $in : idlist}}
  )
  .then( res.json( results));
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
