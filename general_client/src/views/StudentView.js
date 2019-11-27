import React, { Component } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import PropTypes from 'prop-types';
import { addRecord } from '../actions/recordActions';
import { connect } from 'react-redux';
import good from '../images/good.png';
import okay from '../images/okay.png';
import confused from '../images/confused.png';
import axios from 'axios';

//import Cookies from 'universal-cookie';

//const cookies = new Cookies();
//cookies.set('sessionID', 'Pacman', { path: '/' });

axios.defaults.withCredentials = true

class StudentView extends Component {
    constructor(props) {
        super(props);
        this.changeBtnValue = this.changeBtnValue.bind(this);

        this.state = {
            studentID: "",
            sessionID: "",
            old_value: 0,
            value: 0,
        };
    }
    
    changeBtnValue(btnValue) {
        this.setState({
            old_value: this.state.value,
            value: btnValue.currentTarget.value
        },
            () => console.log(this.state)
        );

        const newRecord = {
            studentID: this.state.studentID,
            sessionID: this.state.sessionID,
            old_value: this.state.old_value,
            value: this.state.value
        }

        this.props.addRecord(newRecord);
    }

    render() {
        return (
            <ButtonGroup vertical style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }} size="lg">
                <button value={3} onClick={this.changeBtnValue} style={{ border: '5px solid white', borderRadius: '40%' }}><img src={good} style={{ width: '100px', height: '100px' }} /></button>
                <button value={2} onClick={this.changeBtnValue} style={{ border: '5px solid white', borderRadius: '40%' }}><img src={okay} style={{ width: '100px', height: '100px' }} /></button>
                <button value={1} onClick={this.changeBtnValue} style={{ border: '5px solid white', borderRadius: '40%' }}><img src={confused} style={{ width: '100px', height: '100px' }} /></button>
            </ButtonGroup>
        );
    }
}

const mapStateToProps = state => ({
    studentID: state.studentID,
    sessionID: state.sessionID,
    value: state.value,
    old_value: state.old_value
});

export default connect(
    mapStateToProps,
    { addRecord }
)(StudentView);