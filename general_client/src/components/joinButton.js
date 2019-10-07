import React, { Component} from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import { Form, Button, FormGroup, FormControl, ControlLabel, Container } from "react-bootstrap";


export default class landingPage extends Component {
    render() {
      return (
          <div>
        <Container style={{width: 300, height: 70, alignSelf: 'center', justifyContent: 'center'}}>
        <Button variant="dark">Dark</Button>
  </Container>
  
  </div>
      );
    }
  }