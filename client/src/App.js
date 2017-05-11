import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import RecipeList from './RecipeList';
import Recipe from './Recipe';
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
  render = () => {
    const app_style = {
      fontSize: "1.5em"
    };
    return (
      <div className="App" style={app_style}>
        <Router>
          <div>
            <div className="nav">
              <ul>
                <li><Link to="/">Home</Link></li>
              </ul>
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
