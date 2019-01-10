require("dotenv").config();

var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var action = process.argv[2];

// switch cases for commands
switch (action) {
  case "concert-this":
    concerts();
    break;

  case "spotify-this-song":
    song();
}


function concerts() {
  var nodeArgs = process.argv;
  var artistName = "";

  for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
      artistName = artistName + "+" + nodeArgs[i];
    }
    else {
      artistName += nodeArgs[i];

    }
  }

  axios.get("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp").then(
    function(response) {
      for (i=0; i < response.data.length; i++) {
        // console.log(response.data[i].venue);
        console.log(response.data[i].venue.name);
        if (response.data[i].venue.region === "") {
          console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
        } else {
          console.log(response.data[i].venue.city + ", " + response.data[i].venue.region);
        }
        console.log(moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n");
      }
    }
  );
}

function song() {
  spotify.search({ type: 'track', query: 'a greater call' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(data);
    // console.log(JSON.stringify(data, null, 2));
    console.log(data.tracks.items[0].artists[0].name);
    console.log(data.tracks.items[0].artists[1].name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].preview_url);
    console.log(data.tracks.items[0].album.name);
    });
}