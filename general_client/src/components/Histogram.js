import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Button, FormControl, Container, Row } from "react-bootstrap";

export class Histogram extends Component {
  //Initial state 
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

  static defaultProps = {
    displayTitle: true
  }
  /*
    this.state = {
        data:{
          title: "Student's Understanding Progression",
          labels: ['Too fast', 'Okay', 'Too slow'],
          datasets:[{
              label: '# of Students',
              data:[39,51,24],
              backgroundColor:[
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)'
              ],
              borderWidth:4,
              borderColor:'#777',
              hoverBorderWidth:3,
              hoverBorderColor: '#000'
          }]
        }
    }
  }   
*/
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', }}>
        <Container >
          <Bar
            data={this.state.chartData}
            options={{
              title: {
                display: true,
                text: 'Number of Students per slot',
                fontsize: 40,
                fontcolor: 'black'
              },
              layout: {

              },
              responsive: true,
            }}
          // data={this.state.data}
          />
        </Container>
      </div>
    )
  }
}
export default Histogram;