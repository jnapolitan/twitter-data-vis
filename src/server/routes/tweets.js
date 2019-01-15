const keys = require('../../config/keys');
const Twitter = require('twitter');
const Sentiment = require('sentiment');


module.exports = (app, io) => {
  let twitter = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token_key,
    access_token_secret: keys.access_token_secret
  });

  let socketConnection;
  let twitterStream;

  let sentiment = new Sentiment();

  app.locals.searchTerm = 'trump'; //Default search term for twitter stream.
  app.locals.showRetweets = false; //Default

  /**
   * Resumes twitter stream.
   */
  const stream = () => {
    console.log('Resuming for ' + app.locals.searchTerm);
    twitter.stream('statuses/filter', {
      track: app.locals.searchTerm
    }, (stream) => {
      stream.on('data', (tweet) => {
        const tweetSentiment = sentiment.analyze(tweet.text);
        if (tweetSentiment.score !== 0 && tweet.text.slice(0, 2) !== 'RT' && tweet.place) {
          tweet.sentiment = tweetSentiment;
          emitData({ 
            name: tweet.place.full_name,
            coordinates: tweet.place.bounding_box.coordinates[0][0],
            text: tweet.text,
            sentiment: tweetSentiment.score
          });
        }
      });

      stream.on('error', (error) => {
        console.log(error);
      });

      twitterStream = stream;
    });
  }

  /**
   * Sets search term for twitter stream.
   */
  app.post('/setSearchTerm', (req, res) => {
    const term = req.body.term;
    app.locals.searchTerm = term;
    app.locals.tweets = [];
    twitterStream.destroy();
    stream();
  });

  //Establishes socket connection.
  io.on("connection", socket => {
    socketConnection = socket;
    stream();
    socket.on("connection", () => console.log("Client connected"));
    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  /**
   * Emits data from stream.
   * @param {String} msg 
   */
  const emitData = (data) => {
    socketConnection.emit("tweets", data);
  };
};
