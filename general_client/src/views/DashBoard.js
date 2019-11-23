import React, { Component } from 'react';
//import LineChart from '../components/LineChart';
import Histogram from '../components/Histogram';

// Establish socket connection for the Professor 
// Connecting to the socket server from clients end
/*
let socket;
if (!socket) {
    socket = io('http://localhost:5000');
}
console.log('THIS IS PROFESSOR CLIENT SOCKET INFO: ', socket);
*/
// Set up Profs socket to recieve data: 
// This will recieve the data from the server
// Then pass it along to each chart component


export class Dashboard extends Component {

  // Setting up states to not hardcode the data
  constructor(){
    super();
    this.state = {
      // Initially, its going to be an empty array
      chartData:{}
    }
  }
  /*
  // Set up Profs socket to recieve data: 
  // This will recieve the data from the server
  // Then pass it along to each chart component
  
  socket.on("someEvent", (rating) => {
    // Sets the front end state end to w.e the new values 
    this.setState({
        placeholderValue: JsonParameters.newCode
    });

  });
*/
componentWillMount(){
  this.getChartData();
}

getChartData(){
  // Ajax calls here
  this.setState({
    chartData:{
      labels: ['Too fast', 'Okay', 'Too slow'],
      datasets:[
        {
          label:'# Of Students',
          data:[
            39,
            51,
            24
          ],
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