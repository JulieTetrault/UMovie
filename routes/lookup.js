var itunes = require('../common/itunes');
var youtube = require('../common/youtube');
var tmdb = require('../common/tmdb');


exports.getActor = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movieArtist'
    }, res, callback, 'single');
};

exports.getActorTmdb = function (req, res, callback) {
    console.log(req.params.id);
    tmdb.lookupActor({
        q : req.params.id
    }, res, callback);
};

exports.getActorMovies = function (req, res, callback) {
    itunes.lookup({
        id: req,
        entity: 'movie'
    }, res, callback, 'many');
};

exports.getMovieItunes = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movie'
    }, res, callback, 'single');
};

exports.getMovieImdb = function (req, res, callback) {
    tmdb.lookupMovie({
        id: req.params.id,
    }, res, callback, 'single');
};

exports.getSerieImdb = function (req, res, callback) {
    tmdb.lookupSerie({
        id: req.params.id,
    }, res, callback, 'single');
};



exports.getTrailerTv = function (req, res, callback) {
    youtube.searchTrailer({
        key : 'AIzaSyC0tF7MUWtVaGEnxQWOOjHSGA_Ty_nE9go',
        part : 'snippet',
        q: req.query.q + " trailer hd"
    }, res, callback);
};

exports.getTvShowSeason = function (req, res, callback) {
    itunes.lookup({
        id: req,
        entity: 'tvSeason'
    }, res, callback, 'single');
};

exports.getTvShowEpisodes = function (req, res, callback) {
    itunes.lookup({
        id: req,
        entity: 'tvEpisode'
    }, res, callback, 'many');
};