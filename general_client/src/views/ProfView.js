import React, { Component } from 'react';
import SessionsList from '../components/SessionsList';
import ItemModal from '../components/itemModal';
import { Container } from 'reactstrap';
import { Provider } from 'react-redux';
import store from '../store';
import axios from 'axios';
import { PublicURL } from '../config/constants';

//Now that I have SessionsList, I need to create another component that creates a div with the course code as the header, based on how many courses the Prof has under his name. 
//Make a query 

export default class ProfView extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className='ProfView'>
          <Container>
            <ItemModal />
            <SessionsList />
          </Container>
        </div>
      </Provider>
    );
  }
}
