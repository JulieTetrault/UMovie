var request = require('request');
var itunes = require('../common/itunes');
var tmdb = require('../common/tmdb');

exports.getListMoviesByGenre = function (req, res, callback) {
    tmdb.discoverMovie({
        sort_by: 'popularity.desc',
        include_adult:false,
        include_video:false,
        page: req.query.page,
        with_genres:req.query.genre
    }, res, callback);
};

exports.getListSeriesByGenre = function (req, res, callback) {
    tmdb.discoverSerie({
        sort_by: 'popularity.desc',
        include_adult:false,
        include_video:false,
        page:1,
        with_genres:req.query.genre
    }, res, callback);
};

exports.getListActorsPopular = function (req, res, callback) {
    tmdb.discoverActor({
        sort_by: 'popularity.desc',
        include_adult:false,
        include_video:false,
        page:1,
        with_genres:req.query.genre
    }, res, callback);
};

exports.getMoviesGenres = function (req, res) {
    getGenres(req, res, '33');
};

exports.getMoviesGenresImdb = function (req, res, callback) {
    tmdb.genresMovie({}, res, callback);
};

exports.getTvShowsGenres = function (req, res) {
    getGenres(req, res, '32');
};

exports.getSeriesGenresImdb = function (req, res, callback) {
    tmdb.genresSerie({}, res, callback);
};

function getGenres(req, res, entityCode) {
    request({
            uri: 'https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/genres',
            method: 'GET'
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                successCallback(res, JSON.parse(body), entityCode);
            } else {
                errorCallback(res, error, response, body);
            }
        }
    );
}

function successCallback(res, body, entityCode) {
    // 33 corresponds to the movie entity.
    var genres = [];
    var subgenres = body[entityCode]['subgenres'];
    for (var subgenre in subgenres) {
        var genre = subgenres[subgenre];
        genres.push({id: genre['id'], name: genre['name']})
    }
    res.status(200).send(genres);
}

function errorCallback(res, error, response, body) {
    console.error(error, body);
    res.status(response.statusCode).send(body);
}