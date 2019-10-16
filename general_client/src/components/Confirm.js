import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import { List, ListItem, ListItemText } from '@material-ui/core/';
import Button from '@material-ui/core/Button';

export class Confirm extends Component {
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
    const {
      values: { profID, sessionID }
    } = this.props;
    return (
      <Dialog
        open="true"
        fullWidth="true"
        maxWidth='sm'
      >
        <AppBar title="Confirm User Data" />
        <List>
          <ListItem>
            <ListItemText primary="Professor ID" secondary={profID} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Session ID" secondary={sessionID} />
          </ListItem>
        </List>
        <br />

        <Button
          color="dark"
          variant="contained"
          onClick={this.back}
        >Back</Button>

        <Button
          color="secondary"
          variant="contained"
          onClick={this.continue}
        >Create Session</Button>
      </Dialog>
    );
  }
}

export default Confirm;