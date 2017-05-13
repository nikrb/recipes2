import React from 'react';
import ListItem from './ListItem';
import RecipeActions from './RecipeActions';

export default class Recipe extends React.Component {
  state = {
    _id: "",
    name : "",
    ingredient_entry: "",
    ingredients: [],
    instructions: ""
  };
  dirty = false;
  componentWillMount = () => {
    this.dirty = false;
    console.log( "Recipe mount:", this.props.location.state.recipe);
    const { _id, name, created, ingredients, instructions} = this.props.location.state.recipe;
    // FIXME: I think we can remove the duplication
    this.setState( {
      _id: _id,
      name: name,
      created: created,
      ingredients: ingredients,
      instructions: instructions
    });
  };
  componentWillUnmount = () => {
    const { _id, name, created, ingredients, instructions} = this.state;
    if( this.dirty){
      RecipeActions.updateRecipe( { _id, name,created,ingredients,instructions })
      .then( (result) => {
        console.log( "update recipe when leaving recipe detail (name):", result);
      });
    }
  };
  ingredientChange = (e) => {
    this.setState( { ingredient_entry: e.target.value});
  };
  addIngredient = () => {
    this.dirty = true;
    this.setState( {
      ingredients: [...this.state.ingredients, {text: this.state.ingredient_entry}],
      ingredient_entry: ""
    });
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
    this.dirty = true;
    const nl = this.state.ingredients.filter( item => item.text !== item_id)
    this.setState( { ingredients: nl});
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
    const font_sizing = {
      fontSize: "1em",
      fontFamily: "sans-serif",
      width: "100%"
    };
    const ta_style = { ...font_sizing, height: "8em", width:"100%",
      // we need some space under the text area to grab the resize handle
      marginBottom: "20px",
      marginTop: "10px"
    };
    const scrolly_box = {
      maxHeight: "100px",
      overflowY: "scroll",
      marginBottom: "10px"
    };
    return (
      <div>
        <div>
          <h2>{this.props.item_text}</h2>
        </div>
        <div>
          <input type="text" style={font_sizing} value={this.state.name}
            placeholder="recipe name ..." onChange={this.recipeNameChange} />
        </div>
        <div>
          <input type="text" style={font_sizing} value={this.state.ingredient_entry}
            placeholder="Ingredient..." onChange={this.ingredientChange}
            onKeyUp={this.handleKeyUp}/>
        </div>
        <div style={scrolly_box}>
          <ul>{ingredients}</ul>
        </div>
        <div>
          Instructions:
        </div>
        <div>
          <textarea style={ta_style}
            onChange={this.instructionChange} value={this.state.instructions}>
          </textarea>
        </div>
      </div>
    );
  };
}
