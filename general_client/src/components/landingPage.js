import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button, FormControl, Container } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import NoxLogo from '../images/noxLogo.png'
import axios from 'axios';
import UserForm from './UserForm';

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "10px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
    display: 'block',
    padding: '0px',
    height: '60px',
    width: '100%',
}
export default class landingPage extends Component {
    constructor(props) {
        super(props);
        this.codeBox = React.createRef();
        //this.onJoinSession = this.onJoinSession.bind(this);
        this.state = {
            showComponent: false,
        };
        this._onButtonClick = this._onButtonClick.bind(this);

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
            <div>
                <Container style={{ width: 300 }}>
                    <div style={{ position: 'relative', right: 65 }}>
                        <Image src={NoxLogo} alt='Nox Logo' className='logo' />
                    </div>
                    <InputGroup className="md">
                        <FormControl
                            ref={this.codeBox}
                            placeholder="Session ID"
                            aria-label="Session ID"
                            aria-describedby="basic-addon2"
                        />
                    </InputGroup>

                    <Button style={{ width: 270 }} variant="dark" onClick={this.onJoinSession}>Enter</Button>
                </Container>
                <div >
                    <div style={phantom} />
                    <div style={style}>
                        <Button style={{ width: 270 }} variant="dark" onClick={this._onButtonClick}> Professor? Host a Session!</Button>
                        {this.state.showComponent ?
                            <UserForm /> :
                            null
                        }
                    </div>
                </div>
            </div>
        );
    }
}