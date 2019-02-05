import React, { Component } from 'react';
import './App.css';
import WorldMap from './components/world_map';
import Description from './components/description';
import SearchBar from './components/search_bar';
import SentimentCount from './components/sentiment_count';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Description />
        <SearchBar />
        <WorldMap />
        <SentimentCount />
      </div>
    );
  }
}

export default App;
