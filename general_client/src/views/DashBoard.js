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

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
     // Initially, we have 0 students in each category. 
      okayStudents: 0,
      goodStudents: 0,
      confusedStudents: 0,
    }

    // As the data comes in from the socket, the chart is re-updated.
    socket.on("Data", (JsonParameters) => {
      // Sets the front end state end to w.e the new values 
      console.log("PROF IS: ", JsonParameters);
      this.setState({
        chartData: {
          labels: ['Good', 'Okay', 'Confused'],
          datasets: [
            {
              label: '# Of Students',
              data: [JsonParameters.goodStudents, JsonParameters.okayStudents, JsonParameters.confusedStudents],
              backgroundColor: [
                'rgb(0,128,0,1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 0, 0, 1)'
              ],
              borderWidth: 4,
              borderColor: 'Black',
              hoverBorderWidth: 8,
              hoverBorderColor: 'Black'
            }
          ]
        }
      });
      console.log("THE STATE IS:", this.state);
      console.log("SOCKET FUNCTION WENT THROUGH TO PROF CLIENT ", JsonParameters.socketID);
      console.log(JsonParameters);
      console.log(5);
    });

  }

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
  componentWillMount() {
    this.getChartData();
  }

  getChartData() {

  }
  /*
  // Function to get the chart data from the socket (from socket not yet implemented)
  // Basically going to update the ChartData of the current state
  getChartData(){
    // Get the data from the sockets here and set the stat
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