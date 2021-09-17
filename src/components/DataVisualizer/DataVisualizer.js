import React from "react";
import "./DataVisualizer.css";
import Chart from 'chart.js/auto';

class DataVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }

    this.parseData = this.parseData.bind(this);
    this.createGraphs = this.createGraphs.bind(this);
  }

  componentDidMount() {
    fetch("response.json", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((result) => {
        console.log(this.parseData(result));
        return this.parseData(result);

      })
      .then((parsedData) => {
        this.setState({ data: parsedData });
      }).then(() => {
        this.createGraphs();
      })
  }

  parseData(data) {
    let parsedDataArrays = [];
    let entries = Object.entries(data);
    entries.forEach(dataArray => {
      let elemArray = dataArray[1]['value']['elem'];
      let parsedData = elemArray.filter(element => {
        if (element['f'] === 0) {
          return element;
        }
      });
      let parsedDataValues = {};
      parsedData.forEach((element, index) => {
        parsedDataValues[index] = element.a;
      });
      parsedDataArrays[dataArray[0].toString()] = parsedDataValues;
    });
    console.log(parsedDataArrays);
    return parsedDataArrays;
  }

  createGraphs() {
    let data = Object.entries(this.state.data);
    data.forEach((element, index) => {
      var ctx = document.getElementById("canvas-" + index).getContext('2d');
      var graph = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Dataset ' + (index+1)],
          datasets: [{
            label: 'Analog value',
            data: element[1],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    })

  }

  render() {
    let data = Object.entries(this.state.data);
    let graphs = data.map((element, index) => {
      return <canvas id={"canvas-" + index} height="500" width="600"></canvas>;
    });
    console.log(typeof (this.state.data));

    return (
      <div className="data-visualizer" >
        <h1>Data Visualizer</h1>
        {graphs}
      </div>
    );
  }
}

export default DataVisualizer;
