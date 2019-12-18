import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Button, FormControl, Container, Row } from "react-bootstrap";

export class Histogram extends Component {
  //Initial state of the Histogram, Waits for data to come in. 
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData
    }
  }
  // After the props/data comes in, set new state. 
  componentWillReceiveProps(nextProps) {
    if (nextProps !== undefined && nextProps !== null) {
      this.setState({ chartData: nextProps.chartData });
    }
  }
  // Default actions the Chart will display
  static defaultProps = {
    displayTitle: true
  }
  render() {
    return (
      <div className="Graph">

        <Bar
          // Data is stateless, as the data changes, the state changes
          data={this.state.chartData}
          // Some options for our graph
          options={{
            title: {
              display: true,
              text: 'Students Level of Understanding',
              fontSize: 30,
              fontColor: 'Black'
            },
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                fontColor: "#000"
              }
            },
            tooltips: {
              enabled: true
            },
            scales: {
              scaleOverride: true,
              scaleStartValue: 0,
              scaleStepWith: 1
            },
            responsive: true,
          }}
        />

      </div>
    )
  }
}
export default Histogram;
