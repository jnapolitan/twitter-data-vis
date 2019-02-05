import React, { Component } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { feature } from 'topojson-client';
import socketIOClient from 'socket.io-client'; 
import axios from 'axios';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);

    // Set state to house incoming tweets
    this.state = {
      tweets: []
    };

    // Create socket client in dev/prod environment using window location
    this.socket = socketIOClient(window.location.host);

    // Create array to hold world data for rendering map
    this.worldData = [];

    // Establish svg values
    this.svgWidth = 1200;
    this.svgHeight = 750;
  }

  // Establish map projection for adding visual elements
  projection() {
    return geoMercator()
      .scale(175)
      .translate([this.svgWidth / 2, this.svgHeight / 2]);
  }

  // Pull map data into local state and call render map function
  createMap() {
    axios.get('https://unpkg.com/world-atlas@1/world/110m.json')
      .then(res => {
        if (res.status !== 200) {
          console.log(`There was a problem: ${res.status}`);
          return;
        }
        const data = res.data;
        this.worldData = feature(data, data.objects.countries).features;
        this.renderMap();
      });
  }

  // Draw the map and append svg group to house markers
  renderMap() {
    const svg = select(this.map)
      .append('svg')
      .attr('id', 'svg-map')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`);

    const g = svg.append('g');

    this.worldData.map(data => {
      const path = geoPath().projection(this.projection())(data);

      return g.append('path')
        .attr('d', path)
        .attr('fill', '#000000')
        .attr('stroke', '#FFFFFF')
        .attr('strokeWidth', 0.5);
    });

    svg.append('g').attr('id', 'markers');
  }

  // Clear and re-render markers as new data comes in
  updateMarkers() {
    const g = select(document.getElementById('markers'));
    if (!g) return;
    this.clearMarkers();

    this.state.tweets.map((tweet) => {
      return g.append('circle')
        .attr('cx', this.projection()(tweet.coordinates)[0])
        .attr('cy', this.projection()(tweet.coordinates)[1])
        .attr('r', Math.abs(tweet.sentiment * 2) || 4)
        .attr('fill', this.sentimentColor(tweet.sentiment));
    });
  }

  clearMarkers() {
    const markers = document.getElementById('markers');
    if (markers) {
      while (markers.firstChild) {
        markers.removeChild(markers.firstChild);
      }
    }
  }

  // Set lifecycle methods
  componentDidMount() {
    this.closeSocket();
    this.map = document.getElementById('map');
    this.createMap();
    this.openSocket();
  }

  componentDidUpdate() {
    this.updateMarkers();
  }

  // Assign colors to markers based on sentiment
  sentimentColor(sentiment) {
    if (sentiment < 0) {
      return '#E82C0C';
    } else if (sentiment > 0) {
      return '#1BFF73';
    } else {
      return '#888888';
    }
  }

  // Open the socket for incoming Tweets and update local state
  openSocket() {
    const { socket } = this;
    socket.on('connect', () => {
      console.log('Socket Connected');
      socket.on('tweets', data => {
        let newList = [data].concat(this.state.tweets);
        this.setState({ tweets: newList });
      });
    });
    socket.on('disconnect', () => {
      socket.off('tweets');
      socket.removeAllListeners('tweets');
      console.log('Socket Disconnected');
    });
  }

  // Manually close socket
  closeSocket() {
    const { socket } = this;
    socket.off('tweets');
    socket.removeAllListeners('tweets');
    // axios.post('/destroy');
  }

  render() {
    return <>
        <div id='map' />
      </>;
  }
}