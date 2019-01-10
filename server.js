const express = require('express');
const http = require('http');
// const socketio = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
const keys = require('./config/keys');

const Twit = require('twit');
const Sentiment = require('sentiment');

const server = http.createServer(app);
// const io = socketio(server);

app.use(bodyParser.json());

server.listen(port, () => {
  console.log('server is listening');
});

let currentTweets = {}

let twitter = new Twit({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

const stream = twitter.stream('statuses/filter', {
  track: 'government shutdown'
});

const sentiment = new Sentiment();

stream.on('tweet', function (tweet) {
  // currentTweets[tweet.id] = {
  //   text: tweet.text,
  //   name: tweet.user.name,
  //   location: tweet.user.location
  // };
  tweetSentimentScore = sentiment.analyze(tweet.text).score;
  if (tweetSentimentScore !== 0 && tweet.user.location) {
    console.log(tweetSentimentScore, tweet.user.location);
  }
});