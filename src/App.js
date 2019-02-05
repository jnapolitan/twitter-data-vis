import React, { Component } from 'react';
import './App.css';
import WorldMap from './components/world_map';
import Description from './components/description';
import SearchBar from './components/search_bar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchBar />
        <Description />
        <WorldMap />
      </div>
    );
  }
}

export default App;
