import React, { Component } from 'react';
import ConfidentIcon from '@material-ui/icons/SentimentSatisfiedAltRounded';
import NeutralIcon from '@material-ui/icons/SentimentDissatisfied';
import ConfusedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import PropTypes from 'prop-types';
import { addRecord } from '../actions/recordActions';
import { connect } from 'react-redux';
import good from '../images/good.png';
import okay from '../images/okay.png';
import confused from '../images/confused.png';

let value = 0;

class StudentView extends Component {
    constructor(props) {
        super(props);
        this.changeBtnValue = this.changeBtnValue.bind(this);
        this.state = {
            studentId: "",
            sessionId: "",
            old_value: null,
            value: null,
        };

    }
    changeBtnValue(btnValue) {
        console.log(btnValue.target.value);

        this.setState({
            value: btnValue.currentTarget.value
        },
            () => console.log(this.state)
        );

    }

    static propTypes = {
        addRecord: PropTypes.func.isRequired,
    };
    /*
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
    */
    render() {
        console.log("Inside Render");
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
    rating: state.value
});

export default connect(
    mapStateToProps,
    { addRecord }
)(StudentView);