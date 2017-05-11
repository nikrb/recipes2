import Dexie from 'dexie';

const db = new Dexie( "recipes");
db.version(1).stores({
  recipes: "++id, name"
});

const getAll = () => {
  return db.recipes.toArray();
};
const updateRecipe = ( recipe) => {
  console.log( "@RecipeActions.updateRecipe:", recipe);
  let ret = null;
  if( typeof recipe.id === "undefined" || recipe.id === 0){
    const { created, name, ingredients, instructions} = recipe;
    ret = db.recipes.add( { created, name, ingredients, instructions, dirty:true})
      .then( (res) => {
        dispatchEvent( new CustomEvent( "recipe_update_complete"));
        // return the new objecct id for processing
        return res;
      });
  } else {
    ret = db.recipes.update( recipe.id, {...recipe, dirty:true}).then( (res) => {return 0;});
  }
  return ret;
};
const deleteRecipe = ( recipe_id) => {
  // return db.recipes.where( "id").equals( recipe_id).delete();
  return db.recipes.update( recipe_id, { deleteme: true});
};

const refreshCache = () => {
  console.log( "force cache refresh");
  fetch( '/api/recipes', {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then( checkStatus)
    .then( parseJSON)
    .then( (response) => {
      console.log( "recipe GET response:", response);
    });
};
const syncBackend = () => {
  db.recipes.toArray()
  .then( ( recipes) => {
    let upd = recipes.filter( (recipe) => {
      return recipe.dirty === true || typeof recipe.deleteme !== "undefined";
    });
    console.log( "sync recipes:", upd);
    fetch( '/api/recipes', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( upd)
    })// .then( checkStatus)
      // .then( parseJSON)
      .then( function( response){
        console.log( "post recipe response:", response);
        refreshCache();
    }).catch( (e) => {
      console.error( "post recipe failed:", e);
    });
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
