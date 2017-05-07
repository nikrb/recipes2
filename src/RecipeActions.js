import Dexie from 'dexie';

export default function RecipeActions {
  if( typeof RecipeActions.instance === "undefined"){
    RecipeActions.instance = new Dexie( "hellodexie6");
    RecipeActions.instance.version(1).stores({
      recipes: "++id, name"
    });
  }
  let recipe_list = [];
  getRecipes = () => {
    RecipeActions.instance.recipes.toArray()
    .then( (docs) => {
      this.setState( { recipe_list: docs});
    });
    return recipe_list.map( recipe);
  };
  updateRecipe = ( recipe) => {
    console.log( "@RecipeActions.updateRecipe");
    return true;
  };
  return {
    getRecipes: getRecipes,
    updateRecipe: updateRecipe
  };
}
