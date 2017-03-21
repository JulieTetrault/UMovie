var request = require('request');
var qs = require('querystring');

var searchMovieEndPoint =  'https://api.themoviedb.org/3/search/movie?';
var searchActorEndPoint = 'https://api.themoviedb.org/3/search/person?';

exports.searchMovie = function (parameters, res, callback) {
    queryTmdbApi(searchMovieEndPoint  + qs.stringify(parameters), res, callback);
};

exports.searchActor = function (parameters, res, callback) {
    queryTmdbApi(searchActorEndPoint  + qs.stringify(parameters), res, callback);
};



function queryTmdbApi(url, res, callback) {
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
    var response = {};
    for (i = 0; i < body.results.length; i++){
        var path_img = "https://image.tmdb.org/t/p/original" +body.results[i].backdrop_path;
        var overview = body.results[i].overview;
        response[i]= {"title": body.results[i].title, "backdropImg":path_img, "overview": overview}
    }
    callback(null, response);
}

function errorCallback(res, error, response, body) {
    console.error(error, body);
    res.status(response.statusCode).send(body);
}