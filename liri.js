require("dotenv").config();

var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var action = process.argv[2];

// switch cases for commands
switch (action) {
  case "concert-this":
    concerts();
    break;

  case "spotify-this-song":
    song();
    break;

  case "movie-this":
    movie();
    break;
  
  case "do-what-it-says":
    what();
    break;
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

  // console.log(artistName);
  // console.log(JSON.stringify(artistName));
  // newname = JSON.stringify(artistName);
  // console.log(newname.replace(/['"]+/g, ''))

  axios.get("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp").then(
    function(response) {
      for (i=0; i < response.data.length; i++) {
        // console.log(response.data[i].venue);
        console.log("Venue: " + response.data[i].venue.name);
        if (response.data[i].venue.region === "") {
          console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
        } else {
          console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
        }
        console.log("Date :" + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n");
      }
    }
  );
}

function song() {
  var nodeArgs = process.argv;
  var songName = "";

  if (nodeArgs.length < 4) {
    songName = "ace base the sign"
  }
  else {
    for (var i = 3; i < nodeArgs.length; i++) {
      if (i > 3 && i < nodeArgs.length) {
        songName = songName + "+" + nodeArgs[i];
      }
      else {
        songName += nodeArgs[i];

      }
    }
  }

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(data);
    // console.log(JSON.stringify(data, null, 2));
    var artistName = data.tracks.items[0].artists[0].name;

    // if there are multiple artists on song
    for (i=1; i < data.tracks.items[0].artists.length; i++) {
      if (data.tracks.items[0].artists.length > 1) {
        artistName = artistName + ", " + data.tracks.items[0].artists[i].name;
      }
    }
    console.log("Artist(s): " + artistName);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Preview: " + data.tracks.items[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);
    });
}

function movie() {
  var nodeArgs = process.argv;
  var movieName = "";

  if (nodeArgs.length < 4) {
    movieName = "mr nobody"
  } 
  else {
    for (var i = 3; i < nodeArgs.length; i++) {

      if (i > 3 && i < nodeArgs.length) {
        movieName = movieName + "+" + nodeArgs[i];
      }
      else {
        movieName += nodeArgs[i];
  
      }
    }
  }

  axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy&tomatoes=true").then(
    function(response) {
      // console.log(response);
      console.log("Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.tomatoRating);
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    }
  );
}

function what() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    // console.log(data);
    data = data.split(",");
    // console.log(data);
    // console.log(data[0]);
    // console.log(data[1]);
    
    action = data[0];
    process.argv[3] = data[1];
    switch (action) {
      case "concert-this":
        // method below removes quotation marks from artist name string
        process.argv[3] = data[1].replace(/['"]+/g, '')
        concerts();
        break;
    
      case "spotify-this-song":
        song();
        break;
    
      case "movie-this":
        movie();
        break;
    }
  });
}