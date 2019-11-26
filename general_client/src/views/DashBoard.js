import React, { Component } from 'react';
import LineChart from '../components/LineChart';
import Histogram from '../components/Histogram';


// Set up Profs socket to recieve data: 
// This will recieve the data from the server
// Then pass it along to each chart component


export class Dashboard extends Component {
  render() {
    return (
      <div >
        <Histogram />
        <LineChart />
      </div>

    );
  }
}

export default Dashboard;