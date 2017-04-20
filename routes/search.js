var itunes = require('../common/itunes');
var youtube = require('../common/youtube');
var tmdb = require('../common/tmdb');

exports.searchTrailerMovie = function (req, res, callback) {
    youtube.searchTrailer({
        key : 'AIzaSyBew5ya6Y4_-XBE-3vajgQbeNaPM9YbuLs',
        part : 'snippet',
        q: req + " movie trailer hd"
    }, res, callback);
};

exports.searchTrailerTv = function (req, res, callback) {
    youtube.searchTrailer({
        key : 'AIzaSyBew5ya6Y4_-XBE-3vajgQbeNaPM9YbuLs',
        part : 'snippet',
        q: req + " tv trailer hd"
    }, res, callback);
};


exports.searchTrailerTvEpisode = function (req, res, callback) {
    youtube.searchTrailer({
        key : 'AIzaSyBew5ya6Y4_-XBE-3vajgQbeNaPM9YbuLs',
        part : 'snippet',
        q: req.params.q + " episode trailer hd"
    }, res, callback);
};

exports.searchGlobal = function (req, res, callback) {
    tmdb.multiSearch({
        query: req.query.q,
        page: 1,
        include_adult: false
    }, res, callback);
};

exports.searchTvShows = function (req, res, callback) {
    console.log(req);
    itunes.search({
        term: req,
        media: 'tvShow',
        entity: 'tvSeason',
        limit: 10
    }, res, callback);
};

exports.searchTvShowsSeries = function (req, res, callback) {
    itunes.search({
        term: req.query.q,
        media: 'tvShow',
        entity: 'tvSeason',
        limit: 10
    }, res, callback);
};

exports.searchMovieItunes = function (req, res, callback) {
    itunes.search({
        term: req,
        media: 'movie',
        entity: 'movie',
        limit: 10
    }, res, callback);
};

exports.searchMovieImdb = function (req, res, callback) {
    tmdb.searchMovie({
        query: req.query.q,
        page: 1,
        include_adult: false
    }, res, callback);
};

exports.searchTvShowEpisode = function (req, res) {
    itunes.search({
        attribute : 'tvEpisodeTerm',
        term: req.query.q,
        media: 'tvShow',
        entity: 'tvEpisode',
        limit: req.query.limit || 10
    }, res);
};

exports.searchTvShowSeason = function (req, res) {
    itunes.search({
        term: req.query.q,
        media: 'tvShow',
        entity: 'tvSeason',
        genreId: req.query.genre || '',
        limit: req.query.limit || 10
    }, res);
};

exports.searchActor = function (req, res,  callback) {
    itunes.search({
        attribute : 'movieArtistTerm',
        term: req,
        media: 'movie',
        entity: 'movieArtist',
        limit: 10
    }, res,  callback);
};

exports.searchActorTmdb = function (req, res,  callback) {
    tmdb.searchActor({
        query: req,
        include_adult: false
    }, res, callback);
};
