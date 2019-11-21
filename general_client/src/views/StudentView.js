import React, { Component } from 'react';
import ConfidentIcon from '@material-ui/icons/SentimentSatisfiedAltRounded';
import NeutralIcon from '@material-ui/icons/SentimentDissatisfied';
import ConfusedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import PropTypes from 'prop-types';
import { addRecord } from '../actions/recordActions';
import { connect } from 'react-redux';

let value = 0;

class StudentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: "",
            sessionId: "",
            old_value: null,
            value: null,
        };
    }

    static propTypes = {
        addRecord: PropTypes.func.isRequired,
    };

    onClick = (e) => {
        console.log("Hi, ", this.state);

        this.setState({ value: this.state.value });

        console.log(`Old Valueasass ${this.state.old_value}, New Value ${this.state.value}`);

        const newRecord = {
            studentId: "Hey",
            sessionId: "CSC343",
            rating: this.state.value
        };

        this.setState({ old_value: this.state.value });

        console.log(`Old Value ${this.state.old_value}, New Value ${this.state.value}`);

        this.props.addRecord(newRecord);
    }

    render() {
        console.log("Inside Render");
        return (
            <ButtonGroup vertical style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }} size="lg">
                <IconButton aria-label="happy" onClick={this.onClick.bind(this, this.state.value=3)} size="medium">
                    <ConfidentIcon size="large" />
                </IconButton>
                <IconButton aria-label="neutral" value={2} onClick={this.onClick.bind(this, this.state.value=2)} size="medium">
                    <NeutralIcon size="large" />
                </IconButton>
                <IconButton aria-label="confused" value={1} onClick={this.onClick.bind(this, this.state.value=1)} size="medium">
                    <ConfusedIcon size="large" />
                </IconButton>
            </ButtonGroup>
        );
    }
}

const mapStateToProps = state => ({
    rating: state.value
});

export default connect(
    mapStateToProps,
    { addRecord }
)(StudentView);