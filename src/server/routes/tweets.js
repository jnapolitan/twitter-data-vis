const keys = require('../../config/keys');
const Twit = require('twit');
const Sentiment = require('sentiment');


module.exports = (app, io) => {

  // Configure Twitter streaming client
  const twitter = new Twit({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token: keys.access_token_key,
    access_token_secret: keys.access_token_secret
  });

  // Establish client variables
  let socketConnection;
  let twitterStream;
  let sentiment = new Sentiment();
  let searchTerm = '';

  // Begin Twitter stream if search term is present
  const stream = () => {
    if (searchTerm !== '') {
      twitterStream = twitter.stream('statuses/filter', {
        track: searchTerm
      });

      twitterStream.on('message', (tweet) => {
        console.log(tweet);
        // Filter tweets that aren't geo-tagged
        if (tweet.place) {
          // Append sentiment data to tweet object
          tweet.sentiment = sentiment.analyze(tweet.text);
          // Send data to frontend with socket.io
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
    };

  // Route for setting search term and updating stream
  app.post('/setSearchTerm', (req, res) => {
    const term = req.body.term;
    searchTerm = term;
    if (twitterStream) twitterStream.stop();
    stream();
    console.log('Stream updated for', searchTerm);
  });

  // Route for manually destroying the stream
  app.post('/destroy', (req, res) => {
    if (twitterStream) {
      twitterStream.stop();
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

  // Emits data to the frontend 
  const emitData = (data) => {
    socketConnection.emit('tweets', data);
  };
};
