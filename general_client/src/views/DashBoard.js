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
    constructor(props){
      super(props);
      this.state = {
        okayStudents: 0,
        goodStudents: 0 ,
        confusedStudents: 0,
        chartData:{
          labels: ['Good', 'Okay', 'Confused'],
          datasets:[
            {
              label:'# Of Students',
              data:[0, 0,0],
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
      }
      
  
      socket.on("Data", (JsonParameters) => {
        // Sets the front end state end to w.e the new values 
       
        this.setState({
          chartData:{
            labels: ['Good', 'Okay', 'Confused'],
            datasets:[
              {
                label:'# Of Students',
                data:[JsonParameters.confusedStudents, JsonParameters.okayStudents,JsonParameters.goodStudents],
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
        console.log("THE STATE IS:" ,this.state);
        console.log("SOCKET FUNCTION WENT THROUGH TO PROF CLIENT ", JsonParameters.socketID);
        console.log(JsonParameters);
        console.log(5);
    });

    }
      //this.getChartData = this.getChartData.bind(this);
    
    
    
    
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
  componentWillMount(){
    this.getChartData();
  }
  
  getChartData(){
    
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