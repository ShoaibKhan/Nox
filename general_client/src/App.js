import React, { Component } from 'react';
import AppNavBar from './components/AppNavBar';
import ProfView from './views/ProfView';
import StudentView from './views/StudentView';
import landingPage from './views/LandingPage';
import { Provider } from 'react-redux';
import store from './store';
//import {createStore, applyMiddleware} from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Direct different react components to different URLS
import { BrowserRouter as Router, Route } from "react-router-dom"

//const store = createStore(() => [], {}, applyMiddleware());

class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <div className="App">
            <AppNavBar />
          </div>
          <Route path="/" exact component={landingPage} />
          <Route path="/Prof" exact component={ProfView} />
          <Route path="/Student" exact component={StudentView} />
        </Provider>
      </Router>
    );
  }
}

export default App;