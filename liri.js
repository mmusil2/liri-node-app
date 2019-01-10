require("dotenv").config();
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  
  console.log(data);
  console.log(data.tracks.items[0].name); 
  });