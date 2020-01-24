import React, { Component } from 'react';
//import LineChart from '../components/LineChart';
import Histogram from '../components/Histogram';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';
import '../CSS/Chat.css';
import '../CSS/Histogram.css';
import { Button, FormControl, Container, Row } from "react-bootstrap";
import { PublicURL } from '../config/constants';


// Get current session id from cookie
const cookies = new Cookies();
const sessionID = cookies.get('Prof_sesid');


// Establish socket connection for the Professor
// This will allow the Professor to recieve Data from the server
let socket;

// TO DO: Assign sesID when you create one
let sesID = "iwq_ZWuh";

console.log('THIS IS PROFESSOR CLIENT SOCKET INFO: ', socket);

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.messages = React.createRef();
    //  this.scrollToBottom = this.scrollToBottom.bind(this);  

    this.state = {
      // Initially, we have 0 students in each category. 
      okayStudents: 0,
      goodStudents: 0,
      confusedStudents: 0,
      average_rating: null,
      allMessages: [],
      avgColorRGB: 'grey'
    };



    var that = this;

    // As the data comes in from the socket, the chart is re-updated.
    if (!socket) {
      socket = io(PublicURL + ':5001');
      socket.on('connect', function onConnect() {
        socket.emit('proffesorSocket', { sesid: sessionID, socketID: socket.id });
        console.log(socket.id);
        socket.on("incomingComment", commentJson => {
          console.log(commentJson);
          that.setState({
            allMessages: that.state.allMessages.concat(commentJson)
          });
        });
        socket.on("Data", (JsonParameters) => {
          // Sets the front end state end to w.e the new values 
          console.log("PROF IS: ", JsonParameters);
          // Sets the front end state end to w.e the new values 
          that.setState({
            chartData: {
              labels: ['Good', 'Okay', 'Confused'],
              datasets: [
                {
                  label: 'Number Of Students',
                  data: [JsonParameters.goodStudents, JsonParameters.okayStudents, JsonParameters.confusedStudents],
                  backgroundColor: [
                    'rgba(0,255,0,0.3)', // good
                    'rgba(255,255,0,0.3)', // okay
                    'rgba(255,0,0,0.3)' // confused
                  ],
                  borderWidth: 4,
                  borderColor: 'Grey',
                  hoverBorderWidth: 8,
                  hoverBorderColor: 'Black'
                }
              ]

            },
            average_rating: JsonParameters.average_rating,
            avgColorRGB: JsonParameters.avgRGB
          });
        });
      });
    }
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
    return (
      <div >

        <div className="header" style={{ position: "relative", left: "1%" }}>
          <h2>Session Code: {sessionID}
            <input style={{ display: 'inline', left: '3%', position: "relative", maxWidth: '120px', backgroundColor: this.state.avgColorRGB, fontSize: 30, height: '15%', width: '25%', textAlign: "center" }}
              type="text"
              placeholder={"Avg"}
              value={"Avg: " + this.state.average_rating}>
            </input>

          </h2>
        </div>

        <div >

          <Histogram chartData={this.state.chartData} >
          </Histogram>

          <div className="chat_window">
            <div className="top_menu">
              <div className="buttons">
                <div className="button exit"></div>
                <div className="button minimize"></div>
                <div className="button maximize"></div>
              </div>
              <div className="title">Chat Feed</div>
            </div>
            <ul ref={this.messages} id="messages" className="messages">
              {this.state.allMessages.map((item, i) => <li key={i}>{item.comment} </li>)}
              <div style={{ float: "left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </ul>

            <div className="bottom_wrapper clearfix">

            </div>
          </div>

        </div>




      </div >


      // <LineChart chartData={this.state.chartData} />
    );
  }
}
export default Dashboard;
