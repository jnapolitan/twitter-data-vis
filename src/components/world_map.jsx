import React, { Component } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import socketIOClient from "socket.io-client"; 
import axios from 'axios';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      worlddata: [],
      tweets: [],
      searchTerm: ''
    };

    this.currentSearchTerm = '';

    // this.handleCountryClick = this.handleCountryClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);

    this.socket = socketIOClient("http://localhost:3000/");
    this.svgWidth = 1200;
    this.svgHeight = 750;

    this.handleChange = this.handleChange.bind(this);
  }

  projection() {
    return geoMercator()
      .scale(175)
      .translate([this.svgWidth / 2, this.svgHeight / 2]);
  }

  // handleCountryClick(countryIndex) {
  //   console.log("Clicked on country: ", this.state.worlddata[countryIndex]);
  // }
  handleMarkerClick(markerIndex) {
    const place = this.state.tweets[markerIndex].name;
    const text = this.state.tweets[markerIndex].text;
    alert(`${place}: ${text}`);
  }

  componentDidMount() {
    axios.get("https://unpkg.com/world-atlas@1/world/110m.json")
      .then(res => {
        if (res.status !== 200) {
          console.log(`There was a problem: ${res.status}`);
          return;
        }
        const data = res.data;
        this.setState({ worlddata: feature(data, data.objects.countries).features, });
      });

    const { socket } = this;
    socket.on("connect", () => {
      console.log("Socket Connected");
      socket.on("tweets", data => {
        console.log(data);
        let newList = [data].concat(this.state.tweets);
        this.setState({ tweets: newList });
      });
    });
    socket.on("disconnect", () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
      console.log("Socket Disconnected");
    });
  }

  componentWillUnmount() {
    const { socket } = this;
    socket.off("tweets");
    socket.removeAllListeners("tweets");
  }

  handleChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  handeSubmit() {
    return e => {
      e.preventDefault();
      this.currentSearchTerm = this.state.searchTerm;
      axios.post('/setSearchTerm', {
        term: this.state.searchTerm
      }).then(res => console.log(res)).catch(err => console.log(err));
      this.setState({ 
        tweets: [],
        searchTerm: '' 
      });
    };
  }

  sentimentColor(sentiment) {
    if (sentiment < 0) {
      return "#E82C0C";
    } else if (sentiment > 0) {
      return "#1BFF73";
    } else {
      return "#888888";
    }
  }

  render() {
    const { svgWidth, svgHeight } = this;
    return <>
        <form onSubmit={this.handeSubmit()}>
          <input type="text" onChange={this.handleChange} value={this.state.searchTerm} />
        </form>
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <g className="countries">
            {this.state.worlddata.map((d, i) => (
              <path
                key={`path-${i}`}
                d={geoPath().projection(this.projection())(d)}
                className="country"
                fill={`rgba(38,50,56,${(1 / this.state.worlddata.length) * i})`}
                stroke="#FFFFFF"
                strokeWidth={0.5}
                // onClick={() => this.handleCountryClick(i)}
              />
            ))}
          </g>
          <g className="markers">
            {this.state.tweets.map((tweet, i) => (
              <circle
                key={`marker-${i}`}
                cx={this.projection()(tweet.coordinates)[0]}
                cy={this.projection()(tweet.coordinates)[1]}
                r={Math.abs(tweet.sentiment) || 3}
                fill={this.sentimentColor(tweet.sentiment)}
                className="marker"
                onClick={() => this.handleMarkerClick(i)}
              />
            ))}
          </g>
        </svg>
        <h1>Current search term: {this.currentSearchTerm}</h1>
      </>;
  }


}