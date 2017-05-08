import React from 'react';
import ListItem from './ListItem';
import RecipeActions from './RecipeActions';

export default class Recipe extends React.Component {
  state = {
    id: 0,
    name : "",
    ingredient_entry: "",
    ingredients: [],
    instructions: ""
  };
  dirty = false;
  componentWillMount = () => {
    console.log( "Recipe mount:", this.props.location.state);
    const { id, name, created, ingredients, instructions} = this.props.location.state.recipe;
    // FIXME: I think we can remove the duplication
    this.setState( {
      id: id,
      name: name,
      created: created,
      ingredients: ingredients,
      instructions: instructions
    });
  };
  componentWillUnmount = () => {
    const { name, created, ingredients, instructions} = this.state;
    console.log( RecipeActions);
    if( this.dirty){
      RecipeActions.updateRecipe( { name,created,ingredients,instructions })
      .then( (result) => {
        console.log( "update recipe:", result);
      });
    }
  };
  ingredientChange = (e) => {
    this.setState( { ingredient_entry: e.target.value});
  };
  addIngredient = () => {
    this.dirty = true;
    this.setState( { ingredients: [...this.state.ingredients, {text: this.state.ingredient_entry}]});
  };
  handleKeyUp = (e) => {
    switch( e.keyCode){
      case 13:
        this.addIngredient();
        break;
      default:
        break;
    }
  };
  listClicked = (e) => {};
  deleteClicked = ( item_id) => {
    console.log( "delete item:", item_id);
  };
  recipeNameChange = ( e) => {
    this.dirty = true;
    this.setState( { name: e.target.value});
  };
  instructionChange = (e) => {
    this.dirty = true;
    this.setState( { instructions: e.target.value});
  };
  render = () => {
    const ingredients = this.state.ingredients.map( ( ing, ndx) => {
      return (
        <ListItem key={ndx}  itemClicked={this.listClicked}
          item_id={ing.text} item_text={ing.text} deleteClicked={this.deleteClicked} />
      );
    });
    return (
      <div>
        <div>
          <h2>{this.props.item_text}</h2>
        </div>
        <div>
          <input type="text" value={this.state.name} placeholder="recipe name ..."
            onChange={this.recipeNameChange} />
        </div>
        <div>
          <input type="text" value={this.state.ingredient_entry}
            placeholder="Ingredient..." onChange={this.ingredientChange}
            onKeyUp={this.handleKeyUp}/>
        </div>
        <div>
          <ul>{ingredients}</ul>
        </div>
        <div>
          <textarea onChange={this.instructionChange} value={this.state.instructions}></textarea>
        </div>
      </div>
    );
  };
}
