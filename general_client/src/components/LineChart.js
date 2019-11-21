import React, { Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';

export class LineChart extends Component{
  //Initial state 
  constructor(props){
    super(props);

    this.state = {
      data:{
        title: "Student's Understanding Progression",
        labels: ['10', '20', '30', '40', '50', '60'],
        datasets:[
          {
            label:"Too fast",
            fill: false,
            data:[20,30,25,40,50,30],
            tension:0,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth:3,
            hoverBorderWidth:10,
            hoverBorderColor:'#000'
          },
          {
            label:"Too slow",
            fill: false,
            data:[10,20,11,7,10,12],
            tension:0,
            borderColor: 'rgb(150, 0, 0)',
            borderWidth:3,
            hoverBorderWidth:10,
            hoverBorderColor:'#000'
          },
          {
            label:"Okay",
            fill: false,
            data:[40,30,35,19,10,19],
            tension:0,
            borderColor: 'rgb(0, 0, 255)',
            //backgroundColor:['rgba(0, 255, 0, 0.7)']
            borderWidth:3,
            hoverBorderWidth:10,
            hoverBorderColor:'#000'
          }
        ]
      }
    }
  }

  render(){
    return (
      <div style={{position: "fixed", width:1000, height: 1000}}>
        <Line
         options={{
            title:{
              display:true, 
              text: 'Number of Students over Time',
              fontsize:40,
              fontcolor:'black'
            },
            responsive:true,
          }}
          data={this.state.data}
          />
      </div>
    )
  }
}

export default LineChart;