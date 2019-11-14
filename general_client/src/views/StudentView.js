import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';

import { makeStyles } from '@material-ui/core/styles';
import ConfidentIcon from '@material-ui/icons/SentimentSatisfiedAltRounded';
import NeutralIcon from '@material-ui/icons/SentimentDissatisfied';
import ConfusedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup'

const useStyles = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));

export default function StudentView() {
    const classes = useStyles();
    const handleClick = () => {
        //Send a signal to the backend;
    };

    return (
        <Provider store={store}>
            <ButtonGroup vertical style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }} size="lg">
                <IconButton aria-label="happy" onClick={handleClick} size="large" className={classes.margin}>
                    <ConfidentIcon size="large" className={classes.margin}/>
                </IconButton>
                <IconButton aria-label="neutral" onClick={handleClick} size="large" className={classes.margin}>
                    <NeutralIcon size="large" className={classes.margin}/>
                </IconButton>
                <IconButton aria-label="confused" onClick={handleClick} size="large" className={classes.margin}>
                    <ConfusedIcon size="large" className={classes.margin}/>
                </IconButton>
            </ButtonGroup>
        </Provider>
    );
}