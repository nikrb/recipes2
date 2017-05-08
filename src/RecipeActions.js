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
    ret = db.recipes.add( { created, name, ingredients, instructions})
      .then( (res) => {
        dispatchEvent( new CustomEvent( "recipe_update_complete"));
        // return the new objecct id for processing
        return res;
      });
  } else {
    ret = db.recipes.update( recipe.id, recipe).then( (res) => {return 0;});
  }
  return ret;
};
const deleteRecipe = ( recipe_id) => {
  return db.recipes.where( "id").equals( recipe_id).delete();
};

const RecipeActions = { getAll, updateRecipe, deleteRecipe};
export default RecipeActions;
