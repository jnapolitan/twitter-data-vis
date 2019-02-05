import React, { Component } from 'react';
import './App.css';
import WorldMap from './components/world_map';
import Description from './components/description';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Description />
        <WorldMap />
      </div>
    );
  }
}

export default App;
