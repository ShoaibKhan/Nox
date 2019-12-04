import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getCourses, downloadSession } from '../actions/sessionActions';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';


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


const cookies = new Cookies();
const sessionID = cookies.get('sesid');

class SessionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pid: "Furki"
    };
  }

  static propTypes = {
    getSessions: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
    getCourses: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getCourses(this.state.pid);
  }

  onDownloadClick = id => {
    this.props.downloadSession(id);
  };

  render() {
    const { sessions } = this.props.session;
    return (
      <Container>
        <ListGroup>
          <TransitionGroup className='sessions-list'>
            {sessions.map(session => (
              <CSSTransition timeout={500} classNames='fade'>
                <ListItem button>
                  <IconButton aria-label="add">
                    <AddIcon />
                  </IconButton>
                  <ListItemText primary={session} />
                </ListItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  session: state.session
});

export default connect(
  mapStateToProps,
  { getCourses, downloadSession }
)(SessionsList);








/*
import React, { useState } from 'react';
import { ListGroup } from 'reactstrap';
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
import { connect } from 'react-redux';
import { getSessions, getCourses, downloadSession } from '../actions/sessionActions';
import PropTypes from 'prop-types';

var courses = ["CSC343H5", "STA256H5", "CSC258H5"];
var sessions = ["Week 1 - LEC0102", "Week 2 - LEC0102"];

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

export default function NestedList(props) {

  const [course, setCourse] = useState('Default');
  const [session, setSession] = useState('Default');
  const [pid, setPid] = useState('Furki');
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

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
      {
        courses.map(course =>
          //For each "course" in courses_array, do the following:
          <ListGroup>
            {
              <ListItem button onClick={handleClick}>
                <IconButton className={classes.button} aria-label="add">
                  <AddIcon />
                </IconButton>
                <ListItemText primary={course} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            }
            {course === "CSC343H5" ?
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding> {
                  sessions.map(session =>
                    <ListItem button className={classes.nested}>
                      <IconButton
                        className={classes.button}
                        aria-label="download">
                        <DownloadIcon />
                      </IconButton>
                      <ListItemText primary={session} />
                    </ListItem>
                  )}
                </List>
              </Collapse>
              : null}
          </ListGroup>)}
    </List >
  );
}
*/