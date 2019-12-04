/*
import React, { Component } from 'react';
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
import { getItems, downloadItem } from '../actions/itemActions';
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

class SessionsList extends Component {
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getItems();
  }

  onDownloadClick = id => {
    this.props.downloadItem(id);
  };

  nestedList() {
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
              {course === "CSC343H5" ?
                <ListItem button onClick={handleClick}>
                  <IconButton className={classes.button} aria-label="add">
                    <AddIcon />
                  </IconButton>
                  <ListItemText primary={course} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem> :
                <ListItem button>
                  <IconButton className={classes.button} aria-label="add">
                    <AddIcon />
                  </IconButton>
                  <ListItemText primary={course} />
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

  render() {
    //const { items } = this.props.item;
    return (
      {this.nestedList}
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
});

export default connect(
  mapStateToProps,
  { getItems, downloadItem }
)(SessionsList);
*/


/*                                                                          //working but as old shopping list
import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getSessions, downloadSession } from '../actions/sessionActions';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';

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
  };

  componentDidMount() {
    this.props.getSessions(this.state.pid);
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
            {sessions.map(({ _id, courseCode }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <Button
                    className='remove-btn'
                    color='danger'
                    size='sm'
                    onClick={this.onDownloadClick.bind(this, _id)}
                  >
                    &times;
                    </Button>
                  {courseCode}
                </ListGroupItem>
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
  { getSessions, downloadSession }
)(SessionsList);
*/



/*
import React, { Component } from 'react';
import { ListGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { getSessions, downloadSession, getCourses } from '../actions/sessionActions';
import PropTypes from 'prop-types';
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


class SessionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pid: "Furki",
      courseCode: "Default"
    };

    this.handleClick = this.handleClick.bind(this);
  }


  static propTypes = {
    getSessions: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
    getCourses: PropTypes.func.isRequired,
    course: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getCourses(this.state.pid);
  }

  onDownloadClick = _id => {
    this.props.downloadSession(_id);
  };

  handleClick = () => {
    setOpen(!open);
  };

  render() {
    
const [open, setOpen] = React.useState(false);
    const { sessions } = this.props.session;
    const { courses } = this.props.course;
    const classes = useStyles();
    return (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {`${this.state.pid} Courses`}
          </ListSubheader>
        }
        className={classes.root}
      >
        {
          courses.map(({ _id, course }) =>
            //For each "course" in courses_array, do the following:
            <ListGroup>
              {
                <ListItem button onClick={this.handleClick}>
                  <IconButton key={_id} className={classes.button} aria-label="add">
                    <AddIcon />
                  </IconButton>
                  <ListItemText primary={course} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              }
              {<Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding> {
                  this.props.getSessions(this.state.pid, course),
                  sessions.map(({ _id, session }) =>
                    <ListItem button className={classes.nested}>
                      <IconButton
                        key={_id}
                        className={classes.button}
                        aria-label="download">
                        <DownloadIcon />
                      </IconButton>
                      <ListItemText primary={session} />
                    </ListItem>
                  )}
                </List>
              </Collapse>
              }
            </ListGroup>)}
      </List >
    );
  }
}

const mapStateToProps = state => ({
  session: state.session,
  course: state.course
});

export default connect(
  mapStateToProps,
  { getSessions, getCourses, downloadSession }
)(SessionsList);

*/

import React, { Component } from 'react';
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
import { getItems, downloadItem } from '../actions/itemActions';
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

class SessionsList extends Component {
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getItems();
  }

  onDownloadClick = id => {
    this.props.downloadItem(id);
  };

  nestedList() {
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
              {course === "CSC343H5" ?
                <ListItem button onClick={handleClick}>
                  <IconButton className={classes.button} aria-label="add">
                    <AddIcon />
                  </IconButton>
                  <ListItemText primary={course} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem> :
                <ListItem button>
                  <IconButton className={classes.button} aria-label="add">
                    <AddIcon />
                  </IconButton>
                  <ListItemText primary={course} />
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

  render() {
    //const { items } = this.props.item;
    return (
      {nestedList}
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
});

export default connect(
  mapStateToProps,
  { getItems, downloadItem }
)(SessionsList);
