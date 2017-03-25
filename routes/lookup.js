var itunes = require('../common/itunes');
var youtube = require('../common/youtube');


exports.getActor = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movieArtist'
    }, res, callback, 'single');
};

exports.getActorMovies = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movie'
    }, res, callback, 'many');
};

exports.getMovieItunes = function (req, res, callback) {
    itunes.lookup({
        id: req.params.id,
        entity: 'movie'
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