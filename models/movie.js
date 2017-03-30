var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var modelHelpers = require('./modelHelpers.js');

var movieSchema = new Schema({
    adult: Boolean,
    backdrop_path: String,
    genre_ids: Array,
    id: Number,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number
});

movieSchema.method('toJSON', modelHelpers.toJSON);

var Movie = mongoose.model('Movie', movieSchema);

exports.schema = movieSchema;
exports.model = Movie;