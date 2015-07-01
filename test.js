/* jshint esnext:true */

'use strict';

var request = require('request');
var xml = require('xmlom');

var channels = ['release', 'beta', 'aurora', 'nightly'];

var url = 'https://aus3.mozilla.org/update/1/Firefox/33.0.0/1/Darwin_x86_64-gcc3-u-i386-x86_64/en-US/%CHANNEL%/update.xml';

Promise.all(channels.map(function (channel) {
  return new Promise(function (resolve, reject) {
    request(url.replace('%CHANNEL%', channel), function (err, response, body) {
      resolve(body);
    });
  });
})).then(function (results) {
  console.log(results);
})['catch'](function (err) {
  console.error(err);
});

