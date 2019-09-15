import React, { component } from 'react';
import AppNavBar from './components/AppNavBar';
import ShoppingList from './components/ShoppingList';
import ItemModal from './components/itemModal';
import { Provider } from 'react-redux';
import store from './store';
import { Container } from 'reactstrap';
//import {createStore, applyMiddleware} from 'redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//const store = createStore(() => [], {}, applyMiddleware());

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AppNavBar />
        <Container>
          <ItemModal />
          <ShoppingList />
        </Container>
      </div>
    </Provider>
  );
}

export default App;
