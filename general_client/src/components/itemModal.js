import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { addCourse } from '../actions/sessionActions';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
axios.defaults.withCredentials = true;
const PID = cookies.get('pid') || 'Furki';

class ItemModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            pid: PID,
            courseCode: "default"
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = e => {
        this.setState({ courseCode: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const newCourse = {
            pid: PID, //Get from cookies once authentication is up and running
            courseCode: this.state.courseCode,
        };

        // Add item via addItem action
        this.props.addCourse(newCourse);

        // Close modal
        this.toggle();
    };

    render() {
        return (
            <div>
                <Button
                    color='dark'
                    style={{ marginBottom: '2rem' }}
                    onClick={this.toggle}
                >
                    New Session
          </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add a Course</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for='courseCode'>Course Code</Label>
                                <Input
                                    type='text'
                                    courseCode='courseCode'
                                    id='courseCode'
                                    placeholder='Enter Course Code'
                                    onChange={this.onChange}
                                />
                                <Button color='dark' style={{ marginTop: '2rem' }} block>
                                    Add Course
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    courseCode: state.courseCode
});

export default connect(
    mapStateToProps,
    { addCourse }
)(ItemModal);
