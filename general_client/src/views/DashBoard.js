import React, { Component } from 'react';
//import LineChart from '../components/LineChart';
import Histogram from '../components/Histogram';
import io from 'socket.io-client';
//import data1 from '../../../server.js'

// Establish socket connection for the Professor to recieve data
let socket;
if (!socket) {
    socket = io('http://localhost:5000');
    console.log(socket);
}
console.log('THIS IS PROFESSOR CLIENT SOCKET INFO: ', socket);

  /*
  this.setState({
    placeholderValue: JsonParametersTest.sid
  /)
*/

  export class Dashboard extends Component {
    constructor(){
      super();
      
      this.state = {
        chartData:{}
      }
      this.getChartData = this.getChartData.bind(this);

    socket.on("Data", (JsonParameters) => {
        // Sets the front end state end to w.e the new values 
        this.getChartData(JsonParameters);
        this.setState({
            placeholderValue: JsonParameters.socketID
        });
        console.log("SOCKET FUNCTION WENT THROUGH TO PROF CLIENT ", JsonParameters.socketID);
        console.log(JsonParameters);
        console.log(5);
    });
    };

  // Set up Profs socket to recieve data: 
  // This will recieve the data from the server
  // Then pass it along to each chart component
  /*
  socket.on("someEvent", (rating) => {
    // Sets the front end state end to w.e the new values 
    this.setState({
        placeholderValue: JsonParameters.newCode
    });
  });
  */
  /*
  RecievingData(Good, Okay, Confused){
    this.state.datasets.data = [Good, Okay, Confused];
    this.state.update();
  }
  */ 
  getChartData(JsonParameters){
// goodStudents,okayStudents,confusedStudents
    this.setState({
      chartData:{
        labels: ['Good', 'Okay', 'Confused'],
        datasets:[
          {
            label:'# Of Students',
            data:[ JsonParameters.confusedStudents,JsonParameters.okayStudents , JsonParameters.goodStudents],
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)'
            ],
            borderWidth:4,
            borderColor:'#777',
            hoverBorderWidth:3,
            hoverBorderColor: '#000'
          }
        ]
      }
    });
  }
  /*
  // Function to get the chart data from the socket (from socket not yet implemented)
  // Basically going to update the ChartData of the current state
  getChartData(){
    // Get the data from the sockets here and set the state
    
    this.setState({
      chartData: 
    })
  }
  */
      render() {
        return (
          <div >
            <Histogram chartData={this.state.chartData} />
        </div>
            // <LineChart chartData={this.state.chartData} />
        );
      }
    }
export default Dashboard;