import React, { Component } from 'react';
//import LineChart from '../components/LineChart';
import Histogram from '../components/Histogram';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';


// Get current session id from cookie
const cookies = new Cookies();
const sessionID = cookies.get('sesid');


// Establish socket connection for the Professor
// This will allow the Professor to recieve Data from the server
let socket;

// TO DO: Assign sesID when you create one
let sesID = "iwq_ZWuh";

console.log('THIS IS PROFESSOR CLIENT SOCKET INFO: ', socket);

export class Dashboard extends Component {
  constructor(props) {
    super(props);


    this.state = {
      // Initially, we have 0 students in each category. 
      okayStudents: 0,
      goodStudents: 0,
      confusedStudents: 0
    }

    var that = this;

    if (!socket) {
      socket = io('http://localhost:5000');
      socket.on('connect', function onConnect() {
        socket.emit('proffesorSocket', { sesid: sessionID, socketID: socket.id });
        console.log(socket.id);
        socket.on("Data", (JsonParameters) => {
          // Sets the front end state end to w.e the new values 
          console.log("PROF IS: ", JsonParameters);
          that.setState({
            chartData: {
              labels: ['Good', 'Okay', 'Confused'],
              datasets: [
                {
                  label: 'Number Of Students',
                  data: [JsonParameters.goodStudents, JsonParameters.okayStudents, JsonParameters.confusedStudents],
                  backgroundColor: [
                    'rgb(0,128,0,1)',
                    'rgba(255, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)'
                  ],
                  borderWidth: 4,
                  borderColor: 'Grey',
                  hoverBorderWidth: 8,
                  hoverBorderColor: 'Black'
                }
              ]
            }
          })
        })
      });

    }
  }

  render() {
    return (
      <div >
        <div class="header" style={{ position: "relative", left: "30px" }}>
          <h2>Session Code: {sessionID}</h2>
        </div>
        <Histogram chartData={this.state.chartData} />
      </div>
      // <LineChart chartData={this.state.chartData} />
    );
  }
}
export default Dashboard;