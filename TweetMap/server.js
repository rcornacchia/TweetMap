// Setup web server and socket
var express = require('express'),
    // twitter = require('ntwitter'),
    elasticSearch = require('elasticSearch'),
    bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// create client for elastic search
var client = new elasticSearch.Client({
    host: 'search-candidates-cjppiuv3s4xsksv4prai7gcohm.us-west-2.es.amazonaws.com',
    log: 'trace'
});

// handle requests for specific candidates and all candidates
app.post('/getTweets',function(req,res) {
    var candidate = req.body.candidate;
    console.log(candidate);
    if (candidate == "All Candidates") {
        client.search({
          index: 'geoindex',
          size: 10000,
          body: {
              query : {
                  match_all : {}
              }
          }
        }, function (error, response) {
            res.json(response);

        });
        console.log("Candidate name = "+candidate);
    } else {
        client.search({
            index: 'geoindex',
            size: 10000,
            body: {
                  query : {
                      match : {
                          text: candidate
                      }
                  }
            }
        }, function (error, response) {
            console.log("Testgggg");

            res.json(response);
        });
    }
});

// handle requests for candidates + location
app.post('/getTweetsWithLocation', function(req,res) {
    var candidate = req.body.candidate;
    var lat = req.body.lat;
    var lng = req.body.lng;
    if (candidate == "All Candidates") {
        client.search({
            index: 'geoindex',
            size: 10000,
            body: {
                query: {
                    filtered: {
                        query : {
                            match_all : {}
                        },
                        filter: {
                            geo_distance: {
                                distance: '1000km',
                                location: {
                                    lat: lat,
                                    lon: lng
                                }
                            }
                        }
                    }
                }
            }
        }, function (error, response) {
            res.json(response);
            console.log("Candidate name = "+candidate);
        });
    } else {
        client.search({
            index: 'geoindex',
            size: 10000,
            body: {
                query: {
                  filtered: {
                        query : {
                            match : {
                                text: candidate
                            }
                        },
                      filter: {
                          geo_distance: {
                              distance: '1000km',
                              location: {
                                  lat: lat,
                                  lon: lng
                              }
                          }
                      }
                    }
                  }
            }
        }, function (error, response) {
            res.json(response);
            console.log("Candidate name = "+candidate);

        });
    }
});

// listen on port 3000 or env port
app.listen(process.env.PORT || 8081);

// Setup twitter stream api
// var twit = new twitter({
//     consumer_key: 'cu607zV20zgS5deVCjJphwFfc',
//     consumer_secret: 'niSiKTDe5b30XMshQMmwmLz2SqVfDsksxNIyyVjySALU6YfkYv',
//     access_token_key: '2475805220-VabahyH70uVb5ypd3oI48iLYw1oQSlPIzwB0Yi0',
//     access_token_secret: '3bSwrTiH5ukl3L3lXMfY1zFjB1x6GOUR9DIeLW0zb8vPQ'
// }),
// stream = null;

// // create index
// client.indices.create({
//     index: 'geoindex',
//     body: {
//         mappings: {
//             candidateTweet: {
//                 properties: {
//                     location: {
//                         type: 'geo_point'
//                     }
//                 }
//             }
//         }
//     }
// });


//Create web sockets connection.
// twit.stream('statuses/filter', {
//     track: ['Trump', 'Clinton', 'Sanders', 'Ted Cruz', 'Marco Rubio', 'Ben Carson', 'Kasich', 'Jeb Bush', 'Carly Fiorina', 'Mike Huckabee']
// }, function(stream) {
//     stream.on('data', function (data) {
//         if (data.geo) {
//             console.log(data.place.full_name, data.text, data.geo.coordinates[0], data.geo.coordinates[1]);
//             client.create({
//                 index: 'geoindex',
//                 id: data.id,
//                 type: 'candidateTweet',
//                 body: {
//                     text: data.text,
//                     location: {
//                         "lat": data.geo.coordinates[0],
//                         "lon": data.geo.coordinates[1]
//                     }
//                 }
//             }, function (error, response) {
//                 console.log("inserted record");
//             });
//         }
//     });
// });

// // code used to migrate indices
// client.search({
//     index: 'candidates2',
//     size: 10000,
//     body: {
//         query: {
//           filtered: {
//                 query : {
//                     match_all: {}
//                 },
//             }
//         }
//     }
// }, function (error, response) {
//     data = response;
//     tweets = [];
//     obj = data;
//     var lat, lng, text;
//     for(var i=0; i<obj.hits.hits.length; i++){
//         tweets.push([obj.hits.hits[i]._source.location, obj.hits.hits[i]._source.text]);
//     }
//     tweets.forEach(function(tweet) {
//         lat = parseFloat(tweet[0].lat);
//         lng = parseFloat(tweet[0].lon);
//         text = tweet[1];
//         console.log(text + " lat: " + lat + " lat: " + lng);
//         client.create({
//             index: 'geoindex',
//             type: 'candidateTweet',
//             body: {
//                 text: text,
//                 location: {
//                     "lat": lat,
//                     "lon": lng
//                 }
//             }
//         }, function (error, response) {
//         });
//     });
// });



//TODO add get request
//get candidate_name, and query the elasticsearch db with candidate_name
//upon response return json to client

// TODO add get request
// get tweets within geolocation
