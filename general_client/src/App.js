import React, { component } from 'react';
import AppNavBar from './components/AppNavBar';
import ShoppingList from './components/ShoppingList';
import ItemModal from './components/itemModal';
import landingPage from './components/landingPage';
import joinButton from './components/joinButton'
import { Provider } from 'react-redux';
import store from './store';
import { Container } from 'reactstrap';
//import {createStore, applyMiddleware} from 'redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



// Direct different react components to different URLS
import { BrowserRouter as Router, Route } from "react-router-dom"

//const store = createStore(() => [], {}, applyMiddleware());

function App() {
  return (
    <Router>
      <Provider store={store}>
        <div className="App">
          <AppNavBar />

        </div>
      </Provider>

      <Route path="/" exact component={landingPage} />




    </Router>
  );
}

export default App;
