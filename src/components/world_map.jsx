import React, { Component } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import socketIOClient from "socket.io-client"; 
import axios from 'axios';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      tweets: [],
      searchTerm: ''
    };

    // this.handleCountryClick = this.handleCountryClick.bind(this);
    // this.handleMarkerClick = this.handleMarkerClick.bind(this);
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
  //   console.log("Clicked on country: ", this.state.data[countryIndex]);
  // }
  // handleMarkerClick(markerIndex) {
  //   console.log("Marker: ", this.state.cities[markerIndex]);
  // }

  componentDidMount() {
    axios.get("https://unpkg.com/world-atlas@1/world/110m.json")
      .then(res => {
        if (res.status !== 200) {
          console.log(`There was a problem: ${res.status}`);
          return;
        }
        const data = res.data;
        this.setState({ data: feature(data, data.objects.countries).features, });
      });

    const { socket } = this;
    socket.on("connect", () => {
      console.log("Socket Connected");
      socket.on("tweets", data => {
        console.log(data);
        let newList = [data].concat(this.state.tweets.slice(0, 15));
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
    this.socket.off("tweets");
  }

  handleChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  handeSubmit() {
    return e => {
      e.preventDefault();
      axios.post('/setSearchTerm', {
        term: this.state.searchTerm
      }).then(res => console.log(res)).catch(err => console.log(err));
      this.setState({ tweets: [] });
    };
  }

  sentimentColor(sentiment) {
    if (sentiment < 0) {
      return "#E82C0C";
    } else {
      return "#1BFF73";
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
            {this.state.data.map((d, i) => (
              <path
                key={`path-${i}`}
                d={geoPath().projection(this.projection())(d)}
                className="country"
                fill={`rgba(38,50,56,${(1 / this.state.data.length) * i})`}
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
                r={Math.abs(tweet.sentiment)}
                fill={this.sentimentColor(tweet.sentiment)}
                className="marker"
                // onClick={() => this.handleMarkerClick(i)}
              />
            ))}
          </g>
        </svg>
      </>;
  }


}