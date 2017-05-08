import Dexie from 'dexie';

const db = new Dexie( "recipes");
db.version(1).stores({
  recipes: "++id, name"
});
let recipe_list = [];
const getRecipes = () => {
  db.recipes.toArray()
  .then( (docs) => {
    this.setState( { recipe_list: docs});
  });
  return recipe_list.map( (recipe) => { return recipe;});
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

const RecipeActions = { getRecipes, updateRecipe};
export default RecipeActions;
