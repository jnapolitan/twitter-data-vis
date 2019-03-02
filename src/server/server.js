const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const app = express();
const path = require('path');

const server = http.createServer(app);
const io = socketio(server);

io.attach(server, {
  pingTimeout: 60000,
});

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

require('./routes/tweets.js')(app, io);

server.listen(port, () => {
  console.log('Server listening on port', port);
});