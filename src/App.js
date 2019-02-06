import React, { Component } from 'react';
import './App.css';
import Description from './components/description';
import SearchDisplay from './components/search_display';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Description />
        <SearchDisplay />
      </div>
    );
  }
}

export default App;
