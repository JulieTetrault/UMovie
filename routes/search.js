var itunes = require('../common/itunes');
var tmdb = require('../common/tmdb');
var imdb = require('../common/imdb');


exports.actorImdb = function (req, res, callback) {
    imdb.search({
        api_key : '8c992c14-fde9-409e-8532-7c8d7a307f6e',
        q: req
    }, res, callback);
};

exports.search = function (req, res, callback) {
    itunes.search({
        term: req.query.q,
        media: 'movie,tvShow',
        entity: 'movie,tvSeason',
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
        query: req.query.q,
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

exports.searchActor = function (req, res) {
    itunes.search({
        attribute : 'movieArtistTerm',
        term: req.query.q,
        media: 'movie',
        entity: 'movieArtist',
        limit: req.query.limit || 10
    }, res);
};
