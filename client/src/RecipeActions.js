import Dexie from 'dexie';

const db = new Dexie( "recipes");
db.version(1).stores({
  recipes: "name, deleteme"
});

const getAll = () => {
  return db.recipes.toArray();
};
const updateRecipe = ( recipe) => {
  console.log( "@RecipeActions.updateRecipe:", recipe);
  return db.recipes.put( {...recipe, dirty:true})
          .then( (res) => {
            console.log( "@updateRecipe: update recipe finished:", res);
            dispatchEvent( new CustomEvent( "recipe_update_complete"));
            return res;
          });
};
const deleteRecipe = ( recipe_id) => {
  return db.recipes.update( recipe_id, { deleteme: 1});
};

const syncLocalDB = () => {
  console.log( "@syncLocalDB");
  fetch( '/api/recipes', {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then( checkStatus)
    .then( parseJSON)
    .then( (response) => {
      console.log( "@syncLocalDB: recipe GET response:", response);
      let promises = [];
      response.forEach( ( recipe) => {
        promises.push( db.recipes.put( recipe));
      });
      promises.push( db.recipes.where( "deleteme").aboveOrEqual( 1).delete());
      Dexie.Promise.all( promises).then( (results) => {
        console.log( "@syncLocalDB: updates finished:", results);
        dispatchEvent( new CustomEvent( "recipe_update_complete"));
      });
    });
};
const syncBackend = () => {
  db.recipes.toArray()
  .then( ( recipes) => {
    let upd = recipes.filter( (recipe) => {
      return recipe.dirty === true || typeof recipe.deleteme !== "undefined";
    });
    if( upd.length){
      console.log( "@syncBackend: updating:", upd);
      fetch( '/api/recipes', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( upd)
      }).then( checkStatus)
        .then( parseJSON)
        .then( function( response){
          console.log( "@syncBackend: post updates response:", response);
          syncLocalDB();
      }).catch( (e) => {
        console.error( "@syncBackend: post updates failed:", e);
      });
    } else {
      console.log( "@syncBackend: no recipes to sync");
      syncLocalDB();
    }
  });
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const RecipeActions = { getAll, updateRecipe, deleteRecipe, syncBackend};
export default RecipeActions;
