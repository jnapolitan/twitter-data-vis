const keys = require('../../config/keys');
const Twitter = require('twitter-lite');
const Sentiment = require('sentiment');

module.exports = (app, io) => {

  // Configure Twitter streaming client
  const twitter = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
  });

  // Establish client variables
  let socketConnection, twitterStream, destroy;
  let sentiment = new Sentiment();
  let searchTerm = '';

  // Begin Twitter stream if search term is present
  const stream = () => {
    if (searchTerm !== '') {
      twitterStream = twitter.stream('statuses/filter', {
        track: searchTerm
      });

      twitterStream.on('data', (tweet) => {
        // Append sentiment data to tweet object
        tweet.sentiment = sentiment.analyze(tweet.text);
        // Send data to frontend with socket.io
        socketConnection.emit('tweets', tweet);
      });

      twitterStream.on('error', (error) => {
        console.log(error);
      });
      }
    };

  // Route for setting search term and updating stream
  app.post('/setSearchTerm', (req, res) => {
    const term = req.body.term;
    searchTerm = term;
    if (twitterStream) {
      twitterStream.destroy();
    }
    stream();
    console.log('Stream updated for', searchTerm);
  });

  // Route for manually destroying the stream
  app.post('/destroy', (req, res) => {
    if (twitterStream) {
      twitterStream.destroy();
      console.log('Stream ended');
    }
  });

  //Establishes socket connection.
  io.on('connection', socket => {
    socketConnection = socket;
    stream();
    socket.on('connection', () => console.log('Client connected'));
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
};
