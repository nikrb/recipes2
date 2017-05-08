import React from 'react';
import {Redirect} from 'react-router-dom';
import ListItem from './ListItem';
import RecipeActions from './RecipeActions';

export default class RecipeList extends React.Component {
  state = {
    recipe_list: [],
    selectedRecipe: null
  };
  componentWillMount = () => {
    RecipeActions.getAll()
    .then( (results) => {
      console.log( "recipe list loaded:", results);
      this.setState( {recipe_list: results});
    });

  }
  newClick = (e) => {
    this.setState( { goRecipe: true,
      selectedRecipe: { created: new Date(), name:"", ingredients: [], instructions: []}
    });
  };
  listClicked = ( item_id) => {
    const selectedRecipe = this.state.recipe_list.find( ( recipe) => {
      return recipe.name === item_id;
    });
  };
  deleteClicked = (item_id) => {
    const sel = this.state.recipe_list.filter( (recipe) => {
      return recipe.name === item_id;
    });
  };
  render = () => {
    if( this.state.goRecipe){
      return (
        <Redirect to={{
            pathname: "/recipe",
            state: { recipe: this.state.selectedRecipe}
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
