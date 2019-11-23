import React, { Component } from 'react';
import ConfidentIcon from '@material-ui/icons/SentimentSatisfiedAltRounded';
import NeutralIcon from '@material-ui/icons/SentimentDissatisfied';
import ConfusedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import PropTypes from 'prop-types';
import { addRecord } from '../actions/recordActions';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
cookies.set('sessionID', 'Pacman', { path: '/' });
console.log(cookies.get('myCat')); // Pacman

class StudentView extends Component {
    constructor(props) {
        super(props);
        this.changeBtnValue = this.changeBtnValue.bind(this);
        this.state = {
            studentID: "",
            sessionID: "",
            old_value: null,
            value: null,
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
        };

        this.props.addRecord(newRecord);
    }

    static propTypes = {
        addRecord: PropTypes.func.isRequired,
    };

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