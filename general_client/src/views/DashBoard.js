import React, { Component } from 'react';
//import LineChart from '../components/LineChart';
import Histogram from '../components/Histogram';
import io from 'socket.io-client';


// Establish socket connection for the Professor
// This will allow the Professor to recieve Data from the server
let socket;
if (!socket) {
  socket = io('http://localhost:5000');
  console.log(socket);

}
console.log('THIS IS PROFESSOR CLIENT SOCKET INFO: ', socket);

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
     // Initially, we have 0 students in each category. 
      okayStudents: 0,
      goodStudents: 0,
      confusedStudents: 0,
      average_rating: null
    }

    // As the data comes in from the socket, the chart is re-updated.
    socket.on("Data", (JsonParameters) => {
      // Sets the front end state end to w.e the new values 
      console.log("PROF IS: ", JsonParameters);
      this.setState({
        average_rating: JsonParameters.average_rating,
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
  }

  render() {
    return (
      <div >
        <Histogram chartData={this.state.chartData} />
        <input style={{ position:"right", backgroundColor:'lightblue', fontSize:40, height:100, width:250, textAlign:"center" }}
            type="text"
            placeholder={"Average"}
            value={this.state.average_rating}
         />
      </div>
      // <LineChart chartData={this.state.chartData} />
    );
  }
}
export default Dashboard;