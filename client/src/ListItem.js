import React from 'react';
import './ListItem.css';

export default class ListItem extends React.Component {
  handleClick = () => {
    this.props.itemClicked( this.props.item_id);
  };
  deleteClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.deleteClicked( this.props.item_id);
  };
  render = () => {
    const cross = String.fromCharCode(0x2718);
    return (
      <li onClick={this.handleClick} >
        <a href='' onClick={this.deleteClicked} className="close_button">{cross}</a>
        &nbsp;{this.props.item_text}
      </li>
    );
  }
}
