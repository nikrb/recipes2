import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import RecipeList from './RecipeList';
import Recipe from './Recipe';
import RecipeActions from './RecipeActions';
import './App.css';

class App extends Component {
  componentWillMount = () => {
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
  syncBackend = () => {
    RecipeActions.syncBackend();
  };
  render = () => {
    const sync_style = {
      fontSize: ".7em",
      height: "2em",
      padding: "3px"
    };
    return (
      <div className="App">
        <Router>
          <div>
            <div className="nav">
              <ul>
                <li><Link to="/">Home</Link></li>
              </ul>
              <button type="button" style={sync_style} onClick={this.syncBackend} >Sync</button>
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
