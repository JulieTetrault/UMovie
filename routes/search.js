var itunes = require('../common/itunes');
var youtube = require('../common/youtube');
var tmdb = require('../common/tmdb');

exports.searchTrailerMovie = function (req, res, callback) {
    youtube.searchTrailer({
        key : 'AIzaSyC0tF7MUWtVaGEnxQWOOjHSGA_Ty_nE9go',
        part : 'snippet',
        q: req + " movie trailer hd"
    }, res, callback);
};


exports.searchGlobal = function (req, res, callback) {
    tmdb.multiSearch({
        api_key : '4f185468b45ef3e03d91fc31d962d831',
        query: req.query.q,
        page: 1,
        include_adult: false
    }, res, callback);
};

exports.searchTvShows = function (req, res, callback) {
    itunes.search({
        term: req.query.q,
        media: 'tvShow',
        entity: 'tvSeason',
        limit: req.query.limit || 10
    }, res, callback);
};

exports.searchMovie = function (req, res, callback) {
    itunes.search({
        term: req.query.q,
        media: 'movie',
        entity: 'movie',
        genreId: req.query.genre || '',
        limit: req.query.limit || 10
    }, res, callback);
};

exports.searchMovieImdb = function (req, res, callback) {
    tmdb.searchMovie({
        api_key : '4f185468b45ef3e03d91fc31d962d831',
        query: req,
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
        term: req.query.q,
        media: 'movie',
        entity: 'movieArtist',
        limit: req.query.limit || 10
    }, res,  callback);
};

exports.searchActorTmdb = function (req, res,  callback) {
    tmdb.searchActor({
        api_key : '4f185468b45ef3e03d91fc31d962d831',
        query: req,
        include_adult: false
    }, res, callback);
};
