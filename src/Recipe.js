import React from 'react';

export default class Recipe extends React.Component {
  state = {
    ingredient_entry: ""
  };
  componentWillMount = () => {
    
  };
  componentWillUnmount = () => {

  };
  ingredientChange = (e) => {
    this.setState( { ingredient_entry: e.target.value});
  };
  render = () => {
    return (
      <div>
        <div>
          <h2>{this.props.item_text}</h2>
        </div>
        <div>
          <input type="text" value={this.state.ingredient_entry}
            prompt="Ingredient..." onChange={this.ingredientChange}/>
        </div>
      </div>
    );
  };
}
