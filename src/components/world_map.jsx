import React, { Component } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from "d3-selection";
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

    this.startPingRadius = 5;
    this.endPingRadius = 30;
    this.pingThickness = 2;

    this.handleChange = this.handleChange.bind(this);
  }

  projection() {
    return geoMercator()
      .scale(175)
      .translate([this.svgWidth / 2, this.svgHeight / 2]);
  }

  fetchWorldData() {
    axios.get("https://unpkg.com/world-atlas@1/world/110m.json")
      .then(res => {
        if (res.status !== 200) {
          console.log(`There was a problem: ${res.status}`);
          return;
        }
        const data = res.data;
        this.setState({ worlddata: feature(data, data.objects.countries).features, });
        this.createMap();
      });
  }

  createMap() {
    const svg = select(this.map)
      .append('svg')
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)
      .attr("viewBox", `0 0 ${this.svgWidth} ${this.svgHeight}`);

    const g = svg.append('g');

    this.state.worlddata.map((d, i) => {
      const path = geoPath().projection(this.projection())(d);
      
      g.append("path")
        .attr('d', path)
        .attr('fill', `rgba(38,50,56,${(1 / this.state.worlddata.length) * i})`)
        .attr('stroke', '#FFFFFF')
        .attr('strokeWidth', 0.5);
    });
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
    this.map = document.getElementById('map');
    this.fetchWorldData();
    // this.openSocket();
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

  openSocket() {
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

  radarPing(d) {
    const p = this.projection([d.coordinates[0], d.coordinates[1]]);
    const x = p[0];
    const y = p[1];
    for (var i = 1; i < 5; i += 1) {
        select(this.markers)
          .append("circle")
          .classed("radar-ping", true)
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", this.startPingRadius - (this.pingThickness / 2))
          .style("stroke-width", this.pingThickness / i)
          .style('stroke', this.sentimentColor(d.sentiment))
        .transition()
          .delay(Math.pow(i, 2.5) * 50)
          .duration(1000).ease('quad-in')
          .attr("r", this.endPingRadius)
          .style("stroke-opacity", 0)
          .style('stroke', this.sentimentColor(d.sentiment));
    }
  }

  updateMarkers() {
      select(this.markers)
        .selectAll("circle")
        .data(this.state.tweets)
        .enter()
        .append("circle")
        .classed("point", true)
        .attr("r", 3)
        .each((d) => {
          this.radarPing(d);
        });
      // <circle
      //   key={`marker-${i}`}
      //   cx={this.projection()(tweet.coordinates)[0]}
      //   cy={this.projection()(tweet.coordinates)[1]}
      //   r={Math.abs(tweet.sentiment) || 3}
      //   fill={this.sentimentColor(tweet.sentiment)}
      //   className="marker"
      //   onClick={() => this.handleMarkerClick(i)}
      // />
    // ))
  }

  render() {
    return <>
        <form onSubmit={this.handeSubmit()}>
          <input type="text" onChange={this.handleChange} value={this.state.searchTerm} />
        </form>
        <div id='map' />
        <h1>Current search term: {this.currentSearchTerm}</h1>
      </>;
  }


}