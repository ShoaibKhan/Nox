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
  componentWillReceiveProps(nextProps) {
    if (nextProps != undefined && nextProps != null) {
      this.setState({ chartData: nextProps.chartData });
    }
  }
  // Default Properties the Chart will display
  static defaultProps = {
    displayTitle: true
  }
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', }}>
        <Container >
          <Bar
          // Data is stateless, as the data changes, the state changes
            data={this.state.chartData}
            options={{
              title: {
                display: true,
                text: 'Number of Students per Category',
                fontSize: 30,
                fontColor: 'Black'
              },
              layout: {
                
              },
              responsive: true,
            }}
          />
        </Container>
      </div>
    )
  }
}
export default Histogram;