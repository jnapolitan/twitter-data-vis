const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

server.listen(port, () => {
  console.log('Server is listening on port', port);
});
