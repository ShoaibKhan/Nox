import React, { Component } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { addRecord, addCommentRecord } from '../actions/recordActions';
import { connect } from 'react-redux';
import good from '../images/good.png';
import { Route, Redirect } from 'react-router'
import okay from '../images/okay.png';
import confused from '../images/confused.png';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../CSS/Student.css';

const cookies = new Cookies();
const sid = cookies.get('sid');
const sessionID = cookies.get('sesid');

axios.defaults.withCredentials = true

class StudentView extends Component {
    constructor(props) {
        super(props);
        this.changeBtnValue = this.changeBtnValue.bind(this);
        this.sendComment = this.sendComment.bind(this);
        this.messageBox = React.createRef();
        this.state = {
            studentID: sid,
            sessionID: sessionID,
            old_value: 0,
            value: 0,
            comment: 0,
            isComment: 'false',
            allMessages: []
        };

        //if (cookies.get('sid') == undefined || cookies.get('sesid') == undefined) {
        //   window.location = "/";
        // }
    }

    sendComment(btnValue) {
        btnValue.preventDefault();
        const newRecord2 = {
            studentID: cookies.get('sid'),
            sessionID: cookies.get('sesid'),
            comment: this.messageBox.current.value,
            isComment: 'true',
            showPopup: false,
            value: 0,
            old_value: 0,
        }

        // Send comment via API
        this.props.addCommentRecord(newRecord2);



        this.setState({
            comment: this.messageBox.current.value,
            isComment: 'true',
            showPopup: true,
            allMessages: this.state.allMessages.concat(this.messageBox.current.value)
        }, () => {

            //console.log(newRecord2);
            // Clear input box
            this.messageBox.current.value = '';
            // Display success message
            setTimeout(() => {
                this.setState(() => ({ showPopup: false }))
            }, 5001);
        }
        );

    }

    changeBtnValue(btnValue) {
        console.log('YES');
        const newRecord = {
            studentID: cookies.get('sid'),
            sessionID: cookies.get('sesid'),
            old_value: this.state.value,
            value: btnValue.currentTarget.value,
        }

        this.props.addRecord(newRecord);

        this.setState({
            old_value: this.state.value,
            value: btnValue.currentTarget.value,
        });
    }
   scrollToBottom = () => {
  this.messagesEnd.scrollIntoView({ behavior: "smooth" });
}

componentDidMount() {
  this.scrollToBottom();
}

componentDidUpdate() {
  this.scrollToBottom();
}
    render() {
        if (cookies.get('sid') == undefined || cookies.get('sesid') == undefined) {
            //return <Redirect to='/' />;
            window.location = "/";
        }
        else {
            return (
                <div>


                    <div className='student_buttons'>
                        <ButtonGroup className='student_btn_layout' >
                            <button value={3} onClick={this.changeBtnValue} className='student_button'><img src={good} className='student_img' />
                                <div className="student_label_good">Good</div>
                            </button>
                            <button value={2} onClick={this.changeBtnValue} className='student_button'><img src={okay} className='student_img' />
                                <div className="student_label_okay">Okay</div>
                            </button>
                            <button value={1} onClick={this.changeBtnValue} className='student_button'><img src={confused} className='student_img' />
                                <div className="student_label_confused">Confused</div>
                            </button>
                        </ButtonGroup>
                    </div>

                    <div className="chat_window2">
                        {this.state.showPopup && <div className="top_menu" style={{
                            backgroundColor: '#47cf73', color: 'white', padding: '1em',
                            position: 'relative',
                            borderRadius: '10px',
                            float: 'none',

                            align: 'center',
                            transform: 'translateX(-50 %)',



                        }}>Message Succesfully Sent.</div>}
                        <div className="top_menu">

                            <div className="buttons">
                                <div className="button exit"></div>
                                <div className="button minimize"></div>
                                <div className="button maximize"></div>
                            </div>


                            <div className="title">Ask a Question</div>

                        </div>

                        <ul id="messages" className="messages">
                            {this.state.allMessages.map((item, i) => <li key={i}>{item} </li>)}
                            <div style={{ float:"left", clear: "both" }}
             			ref={(el) => { this.messagesEnd = el; }}>
        		</div>
                        </ul>

                        <div className="bottom_wrapper2 clearfix">
                            <i id="typing"></i>
                            <form id="form">
                                <div className="message_input_wrapper">
                                    <input ref={this.messageBox} id="message" className="message_input" placeholder="Type your message here..." />
                                </div>
                                <button onClick={this.sendComment} className="send_message">
                                    Send
        </button>
                            </form>
                        </div>
                    </div>

                </div >
            );
        }
    }
}

const mapStateToProps = state => ({
    comment: state.comment,
    isComment: state.isComment,
    studentID: state.studentID,
    sessionID: state.sessionID,
    value: state.value,
    old_value: state.old_value,

});


export default connect(
    mapStateToProps,
    { addRecord, addCommentRecord }
)(StudentView);


