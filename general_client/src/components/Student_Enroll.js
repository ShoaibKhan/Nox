import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { fade, withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

const ValidationTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: 'green',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'red',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

export default function CustomizedInputs() {
    const classes = useStyles();

    return (
        <form className={classes.root} noValidate>
            <ValidationTextField
                className={classes.margin}
                label="Session ID"
                required
                variant="outlined"
                defaultValue=""
                id="validation-outlined-input"
            />
        </form>
    );
}