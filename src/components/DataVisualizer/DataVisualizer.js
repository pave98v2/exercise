import React from "react";
import "./DataVisualizer.css";

class DataVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }

    this.parseData = this.parseData.bind(this);
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
      })
  }

  parseData(data) {
    let parsedDataArrays = [];
    let entries = Object.entries(data);
    entries.forEach(dataArray => {
      console.log(dataArray);
      let elemArray = dataArray[1]['value']['elem'];
      let parsedData = elemArray.filter(element => {
        if (element['f'] === 0) {
          return element;
        }
      });
      parsedDataArrays[dataArray[0].toString()] = parsedData;
    });
    return parsedDataArrays;
  }

  render() {
    return (
      <div className="data-visualizer" >
        <h1>Data Visualizer</h1>
        <div>hello</div>
      </div>
    );
  }
}

export default DataVisualizer;
