const express = require('express');
const app = express();
const path = require('path');

const port = 8082;

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "static/views"));

app.get('/', function(req, res) {
  res.render('index');
})

app.listen(port);
console.log("Server is listening on port " + port);