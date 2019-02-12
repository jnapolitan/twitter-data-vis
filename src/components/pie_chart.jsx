import React, { Component } from 'react';
import { select } from 'd3-selection';
import * as d3Shape from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';

export default class PieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      negative: 30,
      neutral: 30,
      positive: 30
    };

    this.width = 300;
    this.height = 300;
    this.radius = Math.min(this.width, this.height);
    this.color = scaleOrdinal()
      .range(["#E82C0C", "#888888", "#1BFF73"]);

    this.arc = arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1)
  }

  componentDidMount() {
    this.closeSocket();
    this.openSocket();
    this.pie = document.getElementById('pie');
    this.drawChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchTerm !== this.props.searchTerm) {
      this.setState({
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
    const arcs = d3Shape.pie(this.state);

    const svg = select(this.pie)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('text-anchor', 'middle')
    
    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    g.selectAll('path')
      .data(arcs)
      .enter().append('path')
        .attr("fill", '#888888')
        .attr("stroke", "white")
        .attr("d", arc)
      .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
  }

  // updateChart() {
  //   const g = select(document.getElementById('bars'));
  //   if (!g) return;
  //   this.clearChart();

  //   const data = [this.state.negativeCount, this.state.neutralCount, this.state.positiveCount];

  //   g.selectAll("rect")
  //     .data(data)
  //     .enter()
  //     .append("rect")
  //     .attr("y", (d, i) => i * 20)
  //     .attr("x", (d, i) => 300 - 10 * d)
  //     .attr("width", (d, i) => d * 10)
  //     .attr("height", 25)
  //     .attr("fill", "green");
  // }

  // clearChart() {
  //   const bars = document.getElementById('bars');
  //   if (bars) {
  //     while (bars.firstChild) {
  //       bars.removeChild(bars.firstChild);
  //     }
  //   }
  // }

  render() {
    return <>
      <div id="pie" />
    </>;
  }
}