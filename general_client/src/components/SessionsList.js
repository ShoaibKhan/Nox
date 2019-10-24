import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/AddBox';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Larry's Courses
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button>
      <IconButton className={classes.button} aria-label="add">
        <AddIcon />
      </IconButton>
        <ListItemText primary="CSC343H5F" />
      </ListItem>
      <ListItem button>
      <IconButton className={classes.button} aria-label="add">
        <AddIcon />
      </IconButton>
        <ListItemText primary="CSC258H5F" />
      </ListItem>
      <ListItem button onClick={handleClick}>
      <IconButton className={classes.button} aria-label="add">
        <AddIcon />
      </IconButton>
        <ListItemText primary="STA256H1S" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
          <IconButton className={classes.button} aria-label="download">
        <DownloadIcon />
      </IconButton>
            <ListItemText primary="Week 1 - LEC0101" />
          </ListItem>
          <ListItem button className={classes.nested}>
          <IconButton className={classes.button} aria-label="download">
        <DownloadIcon />
      </IconButton>
            <ListItemText primary="Week 2 - LEC0102" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
}