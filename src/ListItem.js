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
    return (
      <li onClick={this.handleClick} >
        <a href='' onClick={this.deleteClicked} className="close_button">&#10060;</a>
        {this.props.item_text}
      </li>
    );
  }
}
