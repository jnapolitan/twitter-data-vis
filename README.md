# Twitter Data Vis
#### Visualizing real-time sentiment by topic on Twitter

![screenshot](https://github.com/jnapolitan/twitter-data-vis/blob/master/assets/screenshot.png)

## Background and Overview

Twitter is the mainstream platform for getting a pulse on not only what's happening in the world, but how people are talking about different current current events and happenings.

The goal of this project is to parse and visualize sentiment around topics of conversation happening on Twitter. Through this, I hope to illustrate any deltas in the sentiment surrounding different topics in different parts of the world, or the disparity of conversation at all between one place and another.

## Wireframes

![wireframe](https://github.com/jnapolitan/twitter-data-vis/blob/master/assets/wireframe.png)

## Challenges

There were (are) some challenges in designing a software architecture that lends itself well to a constant incoming stream of data that changes with user input. As soon as the user enter's an initial input, the socket is opened and the incoming stream of data is emitted to the frontend using socket's built in `emit()` function (which is called in the `emitData()` function shown below).

```javascript
if (searchTerm !== '') {
  twitterStream = twitter.stream('statuses/filter', {
    track: searchTerm
  });

  twitterStream.on('data', (tweet) => {
    console.log(tweet);
    // Filter tweets that aren't geo-tagged
    if (tweet.place) {
      // Append sentiment data to tweet object
      tweet.sentiment = sentiment.analyze(tweet.text);
      // Send data to frontend with socket
      emitData({
        name: tweet.place.full_name,
        coordinates: tweet.place.bounding_box.coordinates[0][0],
        text: tweet.text,
        sentiment: tweet.sentiment.score
      });
    }
  });

  twitterStream.on('error', (error) => {
    console.log(error);
  });
}
```

 The frontend React component opens a socket when `componentDidMount()` is called, and listens for each incoming tweet. It then concatenates the incoming tweet with the current state (an array of Tweets) and assigns it to a variable called `newList`. The state is then set to `newList`, and the process repeats itself for each incoming Tweet.

 ```javascript
 openSocket() {
    const { socket } = this;
    socket.on('connect', () => {
      console.log('Socket Connected');
      socket.on('tweets', data => {
        let newList = [data].concat(this.state.tweets);
        this.setState({ tweets: newList });
      });
    });
  }
 ```

When the state is updated and `componentDidUpdate()` is called, the markers on the map are updated to reflect the new data using D3.

```javascript
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
```

Updating the search term is achieved using a post route that updates the Twitter stream on the backend. The current search term is updated for displaying on the frontend, and the state is reset to its defaults while it awaits new incoming data for visualization. 

```javascript
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
```


## Architecture and Technologies

- React for rendering input field and visualization components
- Node.js and Express.js for the backend/server
- Twitter's Stream API and Socket.io to receive incoming data stream
- Twitter Lite (npm package) to handle API config and connections
- D3.js for data visualization (specifically d3-geo and and d3-selection)
- Sentiment (npm package) for AFINN-165 sentiment analysis on text


