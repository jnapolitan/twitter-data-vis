import React, { Component } from 'react';
import { select } from 'd3-selection';

export default class BarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      positiveCount: 0
    };
  }

  componentDidMount() {
    this.closeSocket();
    this.openSocket();
    this.chart = document.getElementById('bar-chart');
    this.drawChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchTerm !== this.props.searchTerm) {
      this.setState({
        totalCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        positiveCount: 0
      });
    }
  }

  openSocket() {
    const { socket } = this.props;
    socket.on('connect', () => {
      socket.on('tweets', data => {
        this.setState({ totalCount: this.state.totalCount + 1 });
        const sentiment = data.sentiment.score;
        if (sentiment < 0) {
          this.setState({
            negativeCount: this.state.negativeCount + 1
          });
        } else if (sentiment > 0) {
          this.setState({
            positiveCount: this.state.positiveCount + 1
          });
        } else {
          this.setState({
            neutralCount: this.state.neutralCount + 1
          });
        }
      });
    });
    socket.on('disconnect', () => {
      socket.off('tweets');
      socket.removeAllListeners('tweets');
    });
  }

  closeSocket() {
    const { socket } = this.props;
    socket.off('tweets');
    socket.removeAllListeners('tweets');
    // axios.post('/destroy');
  }

  drawChart() {
    this.svg = select(this.chart)
      .append("svg")
      .attr("width", 700)
      .attr("height", 300);

    this.svg.append('g').attr('id', 'bars');
  }

  updateChart() {
    const g = select(document.getElementById('bars'));
    if (!g) return;
    this.clearChart();

    const data = [this.state.negativeCount, this.state.neutralCount, this.state.positiveCount];

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d, i) => i * 20)
      .attr("x", (d, i) => 300 - 10 * d)
      .attr("width", (d, i) => d * 10)
      .attr("height", 25)
      .attr("fill", "green");
  }

  clearChart() {
    const bars = document.getElementById('bars');
    if (bars) {
      while (bars.firstChild) {
        bars.removeChild(bars.firstChild);
      }
    }
  }

  render() {
    return <>
      <div id="bar-chart" />
    </>;
  }
}