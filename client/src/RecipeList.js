import React from 'react';
import {Redirect} from 'react-router-dom';
import ListItem from './ListItem';
import RecipeActions from './RecipeActions';

export default class RecipeList extends React.Component {
  state = {
    recipe_list: [],
    goRecipe: false
  };
  selectedRecipe = null;
  getRecipeList = () => {
    RecipeActions.getAll()
    .then( (results) => {
      console.log( "recipe list loaded:", results);
      const nl = results.filter( ( r) => { return typeof r.deleteme === "undefined"; });
      this.setState( {recipe_list: nl});
    });
  };
  componentWillMount = () => {
    RecipeActions.syncBackend();
    this.getRecipeList();
    addEventListener( "recipe_update_complete", this.handleRecipeUpdateComplete);
  };
  componentWillUnmount = () => {
    removeEventListener( "recipe_update_complete", this.handleRecipeUpdateComplete);
  };
  handleRecipeUpdateComplete = () => {
    this.getRecipeList();
  };
  newClick = (e) => {
    this.selectedRecipe = { created: new Date(), name:"", ingredients: [], instructions: []};
    this.setState( { goRecipe: true});
  };
  listClicked = ( item_id) => {
    this.selectedRecipe = this.state.recipe_list.find( ( recipe) => {
      return recipe.name === item_id;
    });
    this.setState( { goRecipe: true});
  };
  deleteClicked = (item_id) => {
    const newlist = this.state.recipe_list.filter( (recipe) => {
      return recipe.name !== item_id;
    });
    this.setState( { recipe_list: newlist});
    const sel = this.state.recipe_list.filter( (recipe) => {
      return recipe.name === item_id;
    });
    console.log( "delete recipe:", sel[0]);
    RecipeActions.deleteRecipe( sel[0].name)
    .then( (res) => {
      console.log( "recipe deleted response:", res);
      this.getRecipeList();
    });
  };
  render = () => {
    if( this.state.goRecipe){
      return (
        <Redirect to={{
            pathname: "/recipe",
            state: { recipe: this.selectedRecipe}
          }} />
      );
    }
    const recipe_list = this.state.recipe_list.map( ( recipe, ndx) => {
      return (
        <ListItem key={ndx} itemClicked={this.listClicked}
          item_id={recipe.name} item_text={recipe.name} deleteClicked={this.deleteClicked} />
      );
    });
    return (
      <div>
        <div>
          <button type="button" onClick={this.newClick}>New</button>
        </div>
        <div>
          <ul>
            {recipe_list}
          </ul>
        </div>
      </div>
    );
  };
}
