var itunes = require('../common/itunes');
var youtube = require('../common/youtube');
var imdb = require('../common/imdb');


exports.actorBio = function (req, res, callback) {
    console.log(req);
    imdb.lookup({
        api_key : '8c992c14-fde9-409e-8532-7c8d7a307f6e',
    }, res, callback);
};

exports.getActor = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movieArtist'
    }, res, callback, 'single');
};

exports.getActorMovies = function (req, res) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movie'
    }, res, 'many');
};

exports.getMovie = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movie'
    }, res, callback, 'single');
};

exports.getTrailer = function (req, res, callback) {
    youtube.lookupTrailer({
        key : 'AIzaSyC0tF7MUWtVaGEnxQWOOjHSGA_Ty_nE9go',
        part : 'snippet',
        q: req.params.movieName + " trailer hd"
    }, res, callback);
};

exports.getTrailerTv = function (req, res, callback) {
    youtube.lookupTrailer({
        key : 'AIzaSyC0tF7MUWtVaGEnxQWOOjHSGA_Ty_nE9go',
        part : 'snippet',
        q: req.query.q + " trailer hd"
    }, res, callback);
};

exports.getTvShowSeason = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'tvSeason'
    }, res, callback, 'single');
};

exports.getTvShowEpisodes = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'tvEpisode'
    }, res, callback, 'many');
};