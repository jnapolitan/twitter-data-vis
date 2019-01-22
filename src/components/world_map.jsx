import React, { Component } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { feature } from 'topojson-client';
import socketIOClient from 'socket.io-client'; 
import axios from 'axios';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);

    // Set component state variables to house world data, 
    // incoming tweets, and search term input
    this.state = {
      worldData: [],
      tweets: [],
      searchTerm: ''
    };

    // Set instance variable for displaying search term
    this.currentSearchTerm = 'Enter a subject';

    // Create socket client in dev/prod environment using window location
    this.socket = socketIOClient(window.location.host);

    // Establish svg values
    this.svgWidth = 1200;
    this.svgHeight = 750;

    // Bind functions for context
    this.handleChange = this.handleChange.bind(this);
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
        this.setState({ worldData: feature(data, data.objects.countries).features, });
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

    this.state.worldData.map(data => {
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
    // this.closeSocket();
    this.map = document.getElementById('map');
    this.createMap();
    this.openSocket();
  }

  componentDidUpdate() {
    this.updateMarkers();
  }

  // Update search term from input field
  handleChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  // Update local state and API stream when search term is submitted
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
    socket.disconnect();
    axios.post('/destroy');
  }

  render() {
    return <>
        <h2>{this.currentSearchTerm}</h2>
        <form onSubmit={this.handeSubmit()}>
          <input
            className='search'
            type='text'
            onChange={this.handleChange}
            value={this.state.searchTerm}
            placeholder='Search...' />
        </form>
        <div id='map' />
        <div className='info-panel'>
          <h3>What is this?</h3>
          <p>This project uses Twitter's Stream API, D3 geo visualization, and sentiment analysis to show how people are talking about particular subjects around the world.</p>
          <p>Enter a subject, and as people tweet about that subject you will see dots appear on the map.</p>
          <p><span className='red'><strong>Red</strong></span> dots indicate negative sentiment.</p>
          <p><span className='green'><strong>Green</strong></span> dots indicate positive sentiment.</p>
          <p><span className='gray'><strong>Gray</strong></span> dots indicate neutral sentiment.</p>
          <p>The <strong>size</strong> of the dots indicate the severity of sentiment. The smaller the dot, the less severe the sentiment.</p>
        </div>
      </>;
  }


}