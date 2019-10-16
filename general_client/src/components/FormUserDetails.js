import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class FormUserDetails extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <Dialog
        open="true"
        fullWidth="true"
        maxWidth='sm'
      >
        <AppBar title="Enter Professor Credentials and SessionID" />
        <TextField
          placeholder="Enter Your ID"
          label="Professor ID"
          onChange={handleChange('profID')}
          defaultValue={values.profID}
          margin="normal"
          fullWidth="true"
        />
        <br />
        <TextField
          placeholder="Enter Your Password"
          label="Password"
          onChange={handleChange('assword')}
          defaultValue={values.password}
          margin="normal"
          fullWidth="true"
        />
        <br />
        <TextField
          placeholder="Enter The Session ID"
          label="Session ID"
          onChange={handleChange('sessionID')}
          defaultValue={values.sessionID}
          margin="normal"
          fullWidth="true"
        />
        <br />
        <Button
          color="primary"
          variant="contained"
          onClick={this.continue}
        >Continue</Button>
      </Dialog>
    );
  }
}

export default FormUserDetails;