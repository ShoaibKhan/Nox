import React, { Component } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { addRecord } from '../actions/recordActions';
import { connect } from 'react-redux';
import good from '../images/good.png';
import okay from '../images/okay.png';
import confused from '../images/confused.png';
import axios from 'axios';

import Cookies from 'universal-cookie';

const cookies = new Cookies();
const sid = cookies.get('sid');
const sessionID = cookies.get('sessionID');

console.log('sid', sid);
console.log('sessionID', sessionID);

axios.defaults.withCredentials = true

class StudentView extends Component {
    constructor(props) {
        super(props);
        this.changeBtnValue = this.changeBtnValue.bind(this);

        this.state = {
            studentID: sid,
            sessionID: sessionID,
            old_value: 0,
            value: 0,
        };

    }
    changeBtnValue(btnValue) {
        const newRecord = {
            studentID: this.state.studentID,
            sessionID: this.state.sessionID,
            old_value: this.state.value,
            value: btnValue.currentTarget.value,
        }

        this.props.addRecord(newRecord);

        this.setState({
            old_value: this.state.value,
            value: btnValue.currentTarget.value
        });
    }

    render() {
        return (
            <ButtonGroup vertical style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }} size="lg">
                <IconButton aria-label="happy" onClick={this.changeBtnValue} value={3} size="medium">
                    <ConfidentIcon size="large" />
                </IconButton>
                <IconButton aria-label="neutral" onClick={this.changeBtnValue} value={2} size="medium">
                    <NeutralIcon size="large" />
                </IconButton>
                <IconButton aria-label="confused" onClick={this.changeBtnValue} value={1} size="medium">
                    <ConfusedIcon size="large" />
                </IconButton>
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