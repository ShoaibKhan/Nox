import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
<<<<<<< HEAD
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
=======
>>>>>>> 48913cca49a780942d8923c46526f6429823747a

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
<<<<<<< HEAD
      //<MuiThemeProvider > 
        //<React.Fragment>
        <Dialog
            open="true"
            fullWidth="true"
            maxWidth='sm'
          >
            <AppBar title="Success" />
            <h4>Session Created!</h4>
            <p>Thank you "Insert Professor Here"</p>
          </Dialog>
        //</React.Fragment>
      //</MuiThemeProvider>
=======
      <Dialog
        open="true"
        fullWidth="true"
        maxWidth='sm'
      >
        <AppBar title="Success" />
        <h4>Session Created!</h4>
        <p>Thank you "Insert Professor Here"</p>
      </Dialog>
>>>>>>> 48913cca49a780942d8923c46526f6429823747a
    );
  }
}

export default Success;