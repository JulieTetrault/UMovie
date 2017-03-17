var itunes = require('../common/itunes');
var youtube = require('../common/youtube');

exports.getActor = function (req, res) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movieArtist'
    }, res, 'single');
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