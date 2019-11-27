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
import { addSession } from '../actions/sessionActions';

class ItemModal extends Component {
    state = {
        modal: false,
        session: "default"
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = e => {
        this.setState({ [e.target.session]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const newSession = {
            session: this.state.session
        };

        // Add item via addItem action
        this.props.addSession(newSession);

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
                    Add a Course
          </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add a Course</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for='courseCode'>Course Code</Label>
                                <Input
                                    type='text'
                                    session='session'
                                    id='session'
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
    session: state.session
});

export default connect(
    mapStateToProps,
    { addSession }
)(ItemModal);