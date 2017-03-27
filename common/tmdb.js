var request = require('request');
var qs = require('querystring');
var async = require('async');

var api_key = 'api_key=4f185468b45ef3e03d91fc31d962d831';
var config_backdrop = 'https://image.tmdb.org/t/p/original';

var listGenresMovieEndPoint = 'https://api.themoviedb.org/3/genre/movie/list?'+api_key;
var multiSearchEndPoint =  'https://api.themoviedb.org/3/search/multi?'+api_key +'&';
var searchMovieEndPoint =  'https://api.themoviedb.org/3/search/movie?'+api_key;
var searchActorEndPoint = 'https://api.themoviedb.org/3/search/person?'+api_key;
var lookupMovieEndPoint = 'https://api.themoviedb.org/3/movie/';
var lookupActorEndPoint = 'https://api.themoviedb.org/3/person/';
var discoverMovieEndPoint = 'https://api.themoviedb.org/3/discover/movie?'+api_key;


exports.genresMovie = function (parameters, res, callback) {
    queryTmdbApi(listGenresMovieEndPoint, res, callback);
};

exports.multiSearch = function (parameters, res, callback) {
    queryTmdbApi(multiSearchEndPoint + qs.stringify(parameters), res, callback);
};

exports.searchMovie = function (parameters, res, callback) {
    queryTmdbApi(searchMovieEndPoint  + qs.stringify(parameters), res, callback);
};

exports.searchActor = function (parameters, res, callback) {
    queryTmdbApi(searchActorEndPoint  + qs.stringify(parameters), res, callback);
};


exports.lookupMovie = function (parameters, res, callback) {
    async.waterfall([
            function(callback){
                queryTmdbApi(lookupMovieEndPoint + parameters.id + '?' + api_key, res, callback);
            },

            function(response, callback) {
                console.log(response);

                var backdrop_path = response.backdrop_path;
                backdrop_path = config_backdrop + backdrop_path;
                response.backdrop_path = backdrop_path;

                var poster_path = response.poster_path;
                poster_path= config_backdrop + poster_path;
                response.poster_path = poster_path;

                console.log("ok");

                callback(null, response);

            } ],
        function(err,results){
            var data = {
                'imdb': results,
            };
            callback(null, data);

        });
};

exports.lookupActor = function (parameters, res, callback) {
    queryTmdbApi(lookupActorEndPoint + parameters.q +'?' + api_key, res, callback);
};

exports.discoverMovie = function (parameters, res, callback) {

    async.waterfall([
        function(callback){
            queryTmdbApi(discoverMovieEndPoint  + '&'+ qs.stringify(parameters), res, callback);
        },

        function(response, callback) {
            var nbResults = response.results.length;
            for(var i = 0; i<nbResults; i++){
                var backdrop_path = response.results[i].backdrop_path;
                backdrop_path = config_backdrop + backdrop_path;
                response.results[i].backdrop_path = backdrop_path;

                var poster_path = response.results[i].poster_path;
                poster_path= config_backdrop + poster_path;
                response.results[i].poster_path = poster_path;

                if(i == nbResults -1){
                    callback(null, response);
                }
            }
        } ],
        function(err,results){
            var data = {
                'imdb': results.results,
            };
            callback(null, data);

        });

};

function queryTmdbApi(url, res, callback) {
    console.log(url);
    request({
            uri: url,
            method: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('api_key', '4f185468b45ef3e03d91fc31d962d831');
            },
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                successCallback(JSON.parse(body), callback);
            } else {
                errorCallback(res, error, response, body);
            }
        }
    );

}


function successCallback(body, callback) {
    callback(null, body);
}

function errorCallback(res, error, response, body) {
    console.error(error, body);
    res.status(response.statusCode).send(body);
}