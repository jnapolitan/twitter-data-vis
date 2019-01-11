const express = require('express');
const http = require('http');
// const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const keys = require('./config/keys');
const Twit = require('twit');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();
const twitter = new Twit({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

const stream = twitter.stream('statuses/filter', {
  track: 'murder'
});

server.listen(port, () => {
  console.log('Server is listening on port', port);
});

 // app.use(bodyParser.urlencoded({ extended: false }));
 // app.use(bodyParser.json());
stream.on('tweet', (tweet) => {
  appendTweet(tweet);
});

const appendTweet = (tweet) => {
  const tweetSentimentScore = sentiment.analyze(tweet.text).score;
  const location = tweet.user.location;
  if (tweetSentimentScore !== 0 && location) {
    // const p = document.createElement('p');
    // p.textContent = `${tweetSentimentScore} : ${location}`;
    // document.body.appendChild(p);
    console.log(tweetSentimentScore, location);
  }
}

