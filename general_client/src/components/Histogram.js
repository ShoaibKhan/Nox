import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';

export class Histogram extends Component{
  //Initial state 
  constructor(props){
    super(props);

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

  render(){
    return (
     <div style={{position: "fixed", width:1800, height:200}}>
        <Bar
        
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
          data={this.state.data}
          />
     </div>
    )
  }
}
export default Histogram;