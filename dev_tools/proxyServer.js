
const http = require('http'),
      request = require('request'),
      bodyParser = require('body-parser'),
      port = 8080;

var express = require('express');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', function(req, res){
  console.log('sending request : ', JSON.stringify(req.body))

  let requestPackageObj = req.body;
  requestPackageObj.body = JSON.stringify(req.body.body)

  request(req.body, function (error, response, body){
    console.log('got remote response', JSON.stringify(body))
    res.json(JSON.parse(body));
  });
});

app.listen(port, function (e) {
  if(e) {
    console.log(e);
  } else {
    console.log(`Proxy Server listening on port ${port}`);
  }
});

request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://localhost/test2.php',
  body:    "mes=heydude"
}, function(error, response, body){
  console.log(body);
});
