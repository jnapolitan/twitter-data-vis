const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
const Twit = require('twit');
const keys = require('./config/keys');

const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());

server.listen(port, () => {
  console.log('server is listening');
});

let twitter = new Twit({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

const stream = twitter.stream('statuses/sample')

stream.on('tweet', function (tweet) {
  console.log(tweet);
});