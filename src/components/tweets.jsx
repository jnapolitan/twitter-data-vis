import React from "react";
import socketIOClient from "socket.io-client";

export default class Tweets extends React.Component {
  constructor(props) {
    super(props);
    this.socket = socketIOClient("http://localhost:3000/");
    this.state = { tweets: [], searchTerm: "JavaScript" };
  }

  componentDidMount() {
    const { socket } = this;
    socket.on('connect', () => {
      console.log("Socket Connected");
      socket.on("tweets", data => {
        console.log(data);
        let newList = [data].concat(this.state.tweets.slice(0, 15));
        this.setState({ tweets: newList });
      });
    });
    socket.on('disconnect', () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
      console.log("Socket Disconnected");
    });
  }

  componentWillUnmount() {
    this.socket.off("tweets");
  }

  render() {
    const tweets = this.state.tweets.map(tweet => {
      return <li>{tweet.place.bounding_box.coordinates[0][0]} : {tweet.sentiment.score}</li>;
    });

    return (
      <>
        <h1>All Tweets</h1>
        <ul>{tweets}</ul>
      </>
    )
  }
}