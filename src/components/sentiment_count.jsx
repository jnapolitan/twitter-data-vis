import React, { Component } from 'react';

export default class SentimentCount extends Component {
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
  }

  // Clear tweets when searchTerm changes
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

  // Open the socket for incoming Tweets and update local state
  openSocket() {
    const { socket } = this.props;
    socket.on('connect', () => {
      socket.on('tweets', data => {
        this.setState({ totalCount: this.state.totalCount + 1});
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
    return <>
      <ul className="sentiment-count">
        <li>Total: {this.state.totalCount}</li>
        <li>Negative: {this.state.negativeCount}</li>
        <li>Neutral: {this.state.neutralCount}</li>
        <li>Positive: {this.state.positiveCount}</li>
      </ul>
    </>
  }
}