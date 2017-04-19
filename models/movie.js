var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var modelHelpers = require('./modelHelpers.js');

var movieSchema = new Schema({
    adult: Boolean,
    backdrop_path: String||null,
    belongs_to_collection: null||Object,
    budget: Number,
    genres: [
        {
            id: Number,
            name: String
        }
    ],
    homepage: String,
    id: Number,
    imdb_id: String,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: null||String,
    production_companies: [
        {
            name: String,
            id: Number
        }
    ],
    production_countries: [
        {
            iso_3166_1: String,
            name: String
        }
    ],
    release_date: String,
    revenue: Number,
    runtime: Number,
    spoken_languages: [
        {
            iso_639_1: String,
            name: String
        }
    ],
    status: String,
    tagline: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,

});

movieSchema.method('toJSON', modelHelpers.toJSON);

var Movie = mongoose.model('Movie', movieSchema);

exports.schema = movieSchema;
exports.model = Movie;