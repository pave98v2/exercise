import React from "react";
import "./DataVisualizer.css";
import Chart from 'chart.js/auto';

/**
 * Component for parsing and visualizing given data.
 */
class DataVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }

    this.parseData = this.parseData.bind(this);
    this.createGraphs = this.createGraphs.bind(this);
    this.countMin = this.countMin.bind(this);
    this.countMax = this.countMax.bind(this);
    this.countAverage = this.countAverage.bind(this);
    this.countStandardDeviation = this.countStandardDeviation.bind(this);
  }


  /**
   * Fetch data from "api" when component is mounted. 
   * 
   */
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


  /**
   * Parses givent data removing faulty data points.
   * @returns {array} parsed data
   */
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


  /**
   * Creates graphs with Chart.js and places them on their given canvas tags.
   */
  createGraphs() {
    let data = Object.entries(this.state.data);
    data.forEach((element, index) => {
      let yValues = [];
      let xValues = [];
      Object.entries(element[1]).forEach((element, index) => {
        yValues[index] = parseInt(element[0]) + 1;
        xValues[index] = element[1];
      });
      console.log(yValues);
      console.log(xValues);
      var ctx = document.getElementById("canvas-" + index).getContext('2d');
      var graph = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: yValues,
          datasets: [{
            label: 'Analog value',
            data: xValues,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        },
        options: {
          data: {
            index: index + 1,
          },
          scales: {
            y: {
              beginAtZero: false,
              max: 100,
            }
          }
        }
      });
    })
  }


  /**
   * Gets the minimun value from given objects data.
   * @param {object} data 
    * @returns {number} the minimum value.
   * 
   */
  countMin(data) {
    data = Object.values(data);
    let length = data.length, min = Infinity;
    while (length--) {
      if (data[length] < min) {
        min = data[length];
      }
    }
    return min;
  }
  /**
    * Gets the maximum value from given objects data.
    * @param {object} data 
    * @returns {number} the maximum value.
    * 
    */
  countMax(data) {
    data = Object.values(data);
    let len = data.length, max = -Infinity;
    while (len--) {
      if (data[len] > max) {
        max = data[len];
      }
    }
    return max;
  }

  /**
    * Counts the average value from given objects data.
    * @param {object} data 
    * @returns {number} the average value.
    * 
    */
  countAverage(data) {
    data = Object.values(data);
    return data.reduce((p, c, i) => { return p + (c - p) / (i + 1) }, 0);
  }

  /**
    * Counts the standard deviation value from given objects data.
    * @param {object} data 
    * @returns {number} the standard deviation.
    */
  countStandardDeviation(data) {
    data = Object.values(data);
    const n = data.length
    const mean = data.reduce((a, b) => a + b) / n
    return Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }

  /**
   * React components render function.
   */
  render() {
    let data = Object.entries(this.state.data);
    let graphs = data.map((element, index) => {
      console.log(element);
      return <div title="canvas" className="chart-container" >
        <canvas id={"canvas-" + index}></canvas>
        <div className="numbers-row">
          <p>Min: <br />{this.countMin(element[1])}</p>
          <p>Max: <br />{this.countMax(element[1])}</p>
          <p>Average: <br />{this.countAverage(element[1])}</p>
          <p>Standard deviation: <br /> {this.countStandardDeviation(element[1])}</p>
        </div>
      </div>;
    });

    return (
      <div className="data-visualizer" >
        <h1>Data Visualizer</h1>
        <div className="graphs-container" >
          {graphs}

        </div>
      </div>
    );
  }
}

export default DataVisualizer;
