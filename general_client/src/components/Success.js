import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';

export class Success extends Component {
  continue = e => {
    e.preventDefault();
    // PROCESS FORM //
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    return (
      <Dialog
        open="true"
        fullWidth="true"
        maxWidth='sm'
      >
        <AppBar title="Success" />
        <h4>Session Created!</h4>
        <p>Thank you "Insert Professor Here"</p>
      </Dialog>
    );
  }
}

export default Success;