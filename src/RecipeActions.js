import Dexie from 'dexie';

const db = new Dexie( "recipes");
db.version(1).stores({
  recipes: "++id, name"
});

const getAll = () => {
  return db.recipes.toArray();
};
const updateRecipe = ( recipe) => {
  console.log( "@RecipeActions.updateRecipe");
  let ret = null;
  if( typeof recipe.id === "undefined" || recipe.id === 0){
    ret = db.recipes.add( recipe);
  } else {
    ret = db.recipes.update( recipe.id, recipe);
  }
  return ret;
};

const RecipeActions = { getAll, updateRecipe};
export default RecipeActions;
