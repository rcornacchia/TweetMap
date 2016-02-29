// TODO
// dropdown starts with All Candidates
// The value of the dropdown should determine what's inside the candidates array
// Bonus



var map;
var tweets = [];

function myCallback(data) {
    // console.log(data);
    var obj = JSON.parse(data);
    for(var i=0; i<obj.hits.hits.length; i++){
        tweets.push([obj.hits.hits[i]._source.location, obj.hits.hits[i]._source.text]);
    }
    // console.log(tweets);

    // console.log(tweets);
    tweets.forEach(function(tweet) {
        // console.log(tweet);
        //
        var position_options = {
            lat: parseFloat(tweet[0].lat),
            lng: parseFloat(tweet[0].lon)
        };
        // var position_options = tweet[0];
        console.log(tweet[0].lat);
        // console.log(position_options);
        var infowindow = new google.maps.InfoWindow({
            content: tweet[1]
        });

        var marker = new google.maps.Marker({
            // color marker according to candidates party
            position: position_options,
            map: map
        });
        google.maps.event.addListener(marker, 'click', (function () {
            infowindow.open(map, marker);
        }));
    });

}

function httpGetAsync(theUrl, callback)
{
    theUrl = "http://search-candidates-cjppiuv3s4xsksv4prai7gcohm.us-west-2.es.amazonaws.com/candidates2/_search?size=200";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function initMap() {

    httpGetAsync("test", myCallback);
    // requirejs.config({
    //     //By default load any module IDs from js/lib
    //     baseUrl: 'js/lib',
    //     //except, if the module ID starts with "app",
    //     //load it from the js/app directory. paths
    //     //config is relative to the baseUrl, and
    //     //never includes a ".js" extension since
    //     //the paths config could be for a directory.
    //     paths: {
    //         app: '../app'
    //     }
    // });
    // requirejs(['jquery', 'canvas', 'app/sub'],
    // function   ($,        canvas,   sub) {
    //     //jQuery, canvas and the app/sub module are all
    //     //loaded and can be used here now.
    //     var client = new $.es.Client({
    //         hosts: 'localhost:9200'
    //     });
    // });



    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38, lng: -97},
        zoom: 5
    });

    // // fetch all tweets from elastic search
    // client.search({
    //     index: 'twitter',
    //     type: 'tweets',
    //     body: {
    //         query: {
    //             match: {
    //                 body: 'elasticsearch'
    //             }
    //         }
    //     }
    // }).then(function (resp) {
    //     var candidates = resp.hits.hits;
    //     console.log(candidates);
    // }, function (err) {
    //     console.trace(err.message);
    // });



}
