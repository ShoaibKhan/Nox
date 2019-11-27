import React from 'react';
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


// // import React, { Component } from 'react';
// // import ListSubheader from '@material-ui/core/ListSubheader';
// // import List from '@material-ui/core/List';
// // import ListItem from '@material-ui/core/ListItem';
// // import ListItemText from '@material-ui/core/ListItemText';
// // import Collapse from '@material-ui/core/Collapse';
// // import AddIcon from '@material-ui/icons/AddBox';
// // import DownloadIcon from '@material-ui/icons/SaveAlt';
// // import ExpandLess from '@material-ui/icons/ExpandLess';
// // import ExpandMore from '@material-ui/icons/ExpandMore';
// // import IconButton from '@material-ui/core/IconButton';
// // import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
// // import { CSSTransition, TransitionGroup } from 'react-transition-group';
// // import { connect } from 'react-redux';
// // import PropTypes from 'prop-types';
// // import { withStyles } from '@material-ui/styles';
// // import { getSessions } from '../actions/sessionActions';

// // const styles = theme => ({
// //   root: {
// //     width: '100%',
// //     maxWidth: 360,
// //     backgroundColor: theme.palette.background.paper,
// //   },
// //   nested: {
// //     paddingLeft: theme.spacing(4),
// //   },
// // });

// // class SessionsList extends Component {
// //   static propTypes = {
// //     getSessions: PropTypes.func.isRequired,
// //     session: PropTypes.object.isRequired,
// //     getCourses: PropTypes.func.isRequired,
// //     course: PropTypes.object.isRequired,
// //   };

// //   componentDidMount() {
// //     this.props.getSessions();
// //     //this.props.getCourses();
// //   }

// //   render() {
// //     const { sessions } = this.props.session;
// //     //const { courses } = this.props.course;

// //     return (
// //       <List
// //         component="nav"
// //         aria-labelledby="nested-list-subheader"
// //         subheader={
// //           <ListSubheader component="div" id="nested-list-subheader">
// //             Larry's Courses
// //       </ListSubheader>
// //         }
// //         className={classes.root}
// //       >
// //         {courses.map(course =>
// //           //For each "course" in courses_array, do the following:
// //           <ListGroup>
// //             <ListItem button onClick={handleClick}>
// //               <IconButton className={classes.button} aria-label="add">
// //                 <AddIcon />
// //               </IconButton>
// //               <ListItemText primary={course} />
// //             </ListItem> :
// //               <ListItem button>
// //               <IconButton className={classes.button} aria-label="add">
// //                 <AddIcon />
// //               </IconButton>
// //               <ListItemText primary={course} />
// //             </ListItem>
// //             <Collapse in={open} timeout="auto" unmountOnExit>
// //               <List component="div" disablePadding> {
// //                 sessions.map(session =>
// //                   <ListItem button className={classes.nested}>
// //                     <IconButton
// //                       className={classes.button}
// //                       aria-label="download">
// //                       <DownloadIcon />
// //                     </IconButton>
// //                     <ListItemText primary={session} />
// //                   </ListItem>
// //                 )}
// //               </List>
// //             </Collapse>
// //           </ListGroup>)
// //         }
// //       </List>




// //       <ListGroup>
// //                   {course === "CSC343H5" ?
// //                     <ListItem button onClick={handleClick}>
// //                       <IconButton className={classes.button} aria-label="add">
// //                         <AddIcon />
// //                       </IconButton>
// //                       <ListItemText primary={course} />
// //                       {open ? <ExpandLess /> : <ExpandMore />}
// //                     </ListItem> :
// //                     <ListItem button>
// //                       <IconButton className={classes.button} aria-label="add">
// //                         <AddIcon />
// //                       </IconButton>
// //                       <ListItemText primary={course} />
// //                     </ListItem>
// //                   }
// //                   {course === "CSC343H5" ?
// //                     <Collapse in={open} timeout="auto" unmountOnExit>
// //                       <List component="div" disablePadding> {
// //                         sessions.map(session =>
// //                           <ListItem button className={classes.nested}>
// //                             <IconButton
// //                               className={classes.button}
// //                               aria-label="download">
// //                               <DownloadIcon />
// //                             </IconButton>
// //                             <ListItemText primary={session} />
// //                           </ListItem>
// //                         )}
// //                       </List>
// //                     </Collapse>
// //                     : null}
// //                 </ListGroup>)






// //             <Container>
// //               <ListGroup>
// //                 <TransitionGroup className='shopping-list'>
// //                   {items.map(({ _id, name }) => (
// //                     <CSSTransition key={_id} timeout={500} classNames='fade'>
// //                       <ListGroupItem>
// //                         {this.props.isAuthenticated ? (
// //                           <Button
// //                             className='remove-btn'
// //                             color='danger'
// //                             size='sm'
// //                             onClick={this.onDeleteClick.bind(this, _id)}
// //                           >
// //                             &times;
// //                           </Button>
// //                         ) : null}
// //                         {name}
// //                       </ListGroupItem>
// //                     </CSSTransition>
// //                   ))}
// //                 </TransitionGroup>
// //               </ListGroup>
// //             </Container>
// //     );
// //   }
// // }

// // const mapStateToProps = state => ({
// //   item: state.item,
// // });

// // export default connect(
// //   mapStateToProps,
// //   { getSessions }
// // )(withStyles)(SessionsList
// // );
// // */