import React, { Component } from 'react';
import './App.css';
import Tweets from './components/tweets';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Tweets />
      </div>
    );
  }
}

export default App;
