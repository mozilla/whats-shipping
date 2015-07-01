/* jshint esnext:true */

var request = require('request');
var express = require('express');
var xml = require('xmlom');
var http = require('http');

var channelNames = [
  'release',
  'beta',
  'aurora',
  'nightly'
];

var url = 'https://aus3.mozilla.org/update/1/Firefox/33.0.0/1/Darwin_x86_64-gcc3-u-i386-x86_64/en-US/%CHANNEL%/update.xml';

var channels = {};

function update() {
  console.log('updating...');
  Promise.all(channelNames.map(function (channel) {
    return new Promise(function (resolve, reject) {
      request(
        url.replace('%CHANNEL%', channel),
        function (err, response, body) {
          xml.parseString(body).then(function (doc) {
            channels[channel] = doc.find('update')[0].attrs;
          }).catch(console.error.bind(console));
        }
      );
    });
  })).catch(function (err) {
    console.error(err);
  });
}

update();
setInterval(update, 5 * 60 * 1000);

var app = express();
app.set('port', (process.env.PORT || 8000));
// app.use(express.static(__dirname + '/static'));
var server = http.createServer(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.json(channels);
});

server.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
