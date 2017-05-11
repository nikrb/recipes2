import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import RecipeList from './RecipeList';
import Recipe from './Recipe';
import './App.css';

class App extends Component {
  state = {
    // font size in em times 10
    font_size : 10
  };
  componentWillMount = () => {
    const size = localStorage.getItem( 'font_size');
    if( size !== null){
      const ns = parseInt( size, 10);
      this.setState( { font_size: ns});
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        }).catch(function(err) {
          console.log(err)
        });
      });
    } else {
      console.log('service worker is not supported');
    }
  };
  smallerFont = () => {
    localStorage.setItem( 'font_size', this.state.font_size-1);
    this.setState( { font_size: this.state.font_size - 1});
  };
  largerFont = () => {
    localStorage.setItem( 'font_size', this.state.font_size+1);
    this.setState( { font_size: this.state.font_size + 1});
  };
  render = () => {
    const app_style = {
      fontSize: `${this.state.font_size/10}em`
    };
    const large_font = {
      fontSize: ".9em",
      margin:"0",
      padding:"2px"
    }
    const small_font = {
      fontSize: ".6em",
      margin:"0",
      padding:"2px"
    };
    return (
      <div className="App" style={app_style}>
        <Router>
          <div>
            <div className="nav">
              <ul>
                <li><Link to="/">Home</Link></li>
              </ul>
              <div>
                <button type="button" style={small_font} onClick={this.smallerFont} >A</button>
                <button type="button" style={large_font} onClick={this.largerFont} >A</button>
              </div>
            </div>
            <hr/>
            <h2>Mum's Recipes</h2>
            <Route exact path="/" component={RecipeList}/>
            <Route path="/recipe" component={Recipe} />
          </div>
        </Router>
      </div>
    );
  };
}

export default App;
