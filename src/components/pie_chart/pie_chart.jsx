import React, { Component } from 'react';
import * as d3Shape from 'd3-shape';
import Slice from './slice';


export default class PieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      negativeCount: 1,
      neutralCount: 1,
      positiveCount: 1
    };

    this.height = 400;
    this.width = 400;
  }

  componentDidMount() {
    this.closeSocket();
    this.openSocket();
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

  render() {
    const pie = d3Shape.pie()([
      this.state.negativeCount,
      this.state.neutralCount,
      this.state.positiveCount
    ]);

    return <>
      <svg height={this.height} width={this.width} className="pie-chart">
        <g transform={`translate(${this.width/2}, ${this.height/2})`}>
          <Slice pie={pie} />
        </g>
      </svg>
    </>;
  }
}