import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button, FormControl, Container, Row } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import NoxLogo from '../images/noxLogo.png'
import axios from 'axios';

//axios.defaults.withCredentials = true

export default class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.codeBox = React.createRef();
        //this.onJoinSession = this.onJoinSession.bind(this);
        this.state = {
            showComponent: false,
        };
        this._onButtonClick = this._onButtonClick.bind(this);
        this.onJoinSession = this.onJoinSession.bind(this);

        this.state = {
            code: ''
        }
    }
    // Enter Button clicked
    // To do: check if empty code
    _onButtonClick() {
        this.setState({
            showComponent: true,
        });
    }

    onJoinSession(codeValue) {
        codeValue.preventDefault();


        this.setState({
            code: this.codeBox.current.value
        });


        const joinSession = {
            sesid: this.codeBox.current.value
        }
        console.log(joinSession)


        // Proxy to avoid CORS error
        // Create proxy in future
        axios.post("http://localhost:5000/api/student", joinSession)
            .then(res => console.log(res));
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }}>
                <Container style={{ width: 300 }}>
                    <Row className="show-grid">
                        <div style={{ position: 'relative', right: 50 }}>
                            <Image src={NoxLogo} alt='Nox Logo' />
                        </div>
                        <InputGroup >
                            <FormControl
                                ref={this.codeBox}
                                placeholder="Session ID"
                                aria-label="Session ID"
                                aria-describedby="basic-addon2"
                            />
                        </InputGroup>
                        <Button style={{ width: 300 }} variant="dark" onClick={this.onJoinSession}>Enter</Button>
                    </Row>
                </Container>
            </div>
        );
    }
}