const keys = require('./config/keys');
const Twit = require('twit');
const Sentiment = require('sentiment');

export default class TweetStream {

  constructor() {
    this.sentiment = new Sentiment();
    this.twitter = new Twit({
     consumer_key: keys.consumer_key,
     consumer_secret: keys.consumer_secret,
     access_token: keys.access_token_key,
     access_token_secret: keys.access_token_secret
    });
  }

  fetchTweets() {
    const stream = this.twitter.stream('statuses/filter', {
      track: 'government shutdown'
    });

    stream.on('tweet', (tweet) => {
    // currentTweets[tweet.id] = {
    //   text: tweet.text,
    //   name: tweet.user.name,
    //   location: tweet.user.location
    // };
    appendTweet(tweet);
  });



  }
  
  appendTweet (tweet) {
    const tweetSentimentScore = this.sentiment.analyze(tweet.text).score;
    const location = tweet.user.location;
    if (tweetSentimentScore !== 0 && location) {
      const p = document.createElement('p');
      p.textContent = `${tweetSentimentScore} : ${location}`;
      document.body.appendChild(p);
      // console.log(tweetSentimentScore, location);
    }
  }
}

// let currentTweets = {}

