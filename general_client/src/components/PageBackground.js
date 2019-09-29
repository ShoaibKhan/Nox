import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { fade, withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles({
    root: {
        width: '100%',
        maxWidth: 500,
    },
});

var colors = ['#FFFDD0', '#FFFDE7', '#0089BB', '#0070A9', '#0A4988'];
var active = 0;
setInterval(function() {
    document.querySelector('body').style.background = colors[active];
    active++;
    if (active == colors.length) active = 0;
}, 1000);


export default function Types() {
    const classes = useStyles();

    return ( < div className = { classes.root } > < /div>);
    }