import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client"; 
import SentimentCount from "./sentiment_count";
import WorldMap from "./world_map";
import BarChart from './bar_chart';

export default class SearchDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ''
    };

    // Set instance variable for displaying search term
    this.currentSearchTerm = 'Enter a subject';

    // Bind functions for context
    this.handleChange = this.handleChange.bind(this);

    // Create socket client to receive emitted data from server
    this.socket = socketIOClient(window.location.host);
  }

  // Update search term from input field
  handleChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  // Update local state and API stream when search term is submitted
  handeSubmit() {
    return e => {
      e.preventDefault();
      this.currentSearchTerm = this.state.searchTerm;
      axios.post('/setSearchTerm', {
        term: this.state.searchTerm
      }).then(res => console.log(res)).catch(err => console.log(err));
      this.setState({ searchTerm: '' });
    };
  }

  render() {
    return (
      <>
        <h2>{this.currentSearchTerm}</h2>
        <form onSubmit={this.handeSubmit()}>
          <input
            className='search'
            type='text'
            onChange={this.handleChange}
            value={this.state.searchTerm}
            placeholder='Search...' 
          />
        </form>
        <SentimentCount socket={this.socket} searchTerm={this.currentSearchTerm} />
        <WorldMap socket={this.socket} searchTerm={this.currentSearchTerm} />
        <BarChart socket={this.socket} searchTerm={this.currentSearchTerm} />
      </>
    )
  }
}