import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';

export class Histogram extends Component{
  //Initial state 
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData
    }
  }

  static defaultProps = {
    displayTitle:true
  }

  render(){
    return (
     <div style={{position: "fixed", width:1800, height:200}}>
        <Bar
         data={this.state.chartData}
         options={{
            title:{
              display:true, 
              text: 'Number of Students per slot',
              fontsize:40,
              fontcolor:'black'
            },
            layout:{
                padding:{
                    left:1200,
                    right:0,
                    bottom:400,
                    top:0
                }
            },
            responsive:true,
          }}
         // data={this.state.data}
      />
     </div>
    )
  }
}
export default Histogram;