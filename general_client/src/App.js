import React, { Component } from 'react';
import AppNavBar from './components/AppNavBar';
import ProfView from './views/ProfView';
import StudentView from './views/StudentView';
import LandingPage from './views/LandingPage';
import DashBoard from './views/DashBoard';
import { Provider } from 'react-redux';
import Cookies from 'universal-cookie';
import store from './store';
//import {createStore, applyMiddleware} from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Direct different react components to different URLS
import { BrowserRouter as Router, Route } from "react-router-dom"

const cookies = new Cookies();
const sid = cookies.get('sid');
const sessionID = cookies.get('sesid');



class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <div className="App">
            <AppNavBar />
          </div>
          <Route path="/" exact component={LandingPage} />
          <Route path="/Prof" exact component={ProfView} />
          <Route path="/Student" exact component={StudentView} />
          <Route path="/DashBoard" exact component={DashBoard} />
        </Provider>
      </Router>
    );
  }
}

export default App;