var express = require('express');
var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var cors = require('cors');
var passport = require('passport');

var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/ubeat';
mongoose.connect(mongoUri);

var authentication = require('./middleware/authentication');
var genres = require('./routes/genres');
var login = require('./routes/login');
var lookup = require('./routes/lookup');
var search = require('./routes/search');
var signup = require('./routes/signup');
var status = require('./routes/status');
var user = require('./routes/user');
var watchlist = require('./routes/watchlists');

var app = express();
var corsOptions = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    credentials: true
};

var tokenSecret = 'UBEAT_TOKEN_SECRET' || process.env.TOKEN_SECRET;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('jwtTokenSecret', tokenSecret);

require('./middleware/passport')(passport, app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'ubeat_session_secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors(corsOptions));

app.get('/status', status.getStatus);
app.get('/login', login.showLoginPage);
app.post('/login', passport.authenticate('local-login'), login.getToken);
app.get('/logout', login.logout);

app.get('/signup', signup.showSignupPage);
app.post('/signup', passport.authenticate('local-signup'), login.getToken);
app.get('/welcome', signup.welcome);

app.get('/token', login.getToken);
app.get('/tokenInfo', authentication.isAuthenticated, login.getToken);

// Secure API

app.get('/discover/movie', authentication.isAuthenticated, function (req, res) {
    async.waterfall([
            function (callback) {
                genres.getListMoviesByGenre(req, res, callback);
            }
        ],
        function (err, results) {
            res.send(results);
        })
});

app.get('/discover/serie', authentication.isAuthenticated, function (req, res) {
    async.waterfall([
            function (callback) {
                genres.getListSeriesByGenre(req, res, callback);
            }
        ],
        function (err, results) {
            res.send(results);
        })
});

app.get('/discover/actor', authentication.isAuthenticated, function (req, res) {
    async.waterfall([
            function (callback) {
                genres.getListActorsPopular(req, res, callback);
            },
        ],
        function (err, results) {
            res.send(results);
        })
});

app.get('/genres/movies', authentication.isAuthenticated, function (req, res) {
    async.waterfall([
            function (callback) {
                genres.getMoviesGenresImdb(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'imdb': results,
            };
            res.send(data);
        })
});

app.get('/genres/tvShows', authentication.isAuthenticated, function (req, res) {
    async.waterfall([
            function (callback) {
                genres.getSeriesGenresImdb(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'imdb': results,
            };
            res.send(data);
        })
});

app.get('/search', authentication.isAuthenticated, function (req, res) {
    async.waterfall([
            function (callback) {
                search.searchGlobal(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'imdb': results.results,
            };
            res.send(data);
            res.end();
        })
});

app.get('/search/tvshows', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                search.searchTvShows(req, res, callback);
            },
            function (callback) {
                lookup.getTrailerTv(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'itunes': results[0],
                'youtube': results[1],
            };
            res.send(data);
        })
});

app.get('/search/actors', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                search.searchActor(req, res, callback);
            }

        ],
        function (err, results) {
            var data = {
                'itunes': results[0],
            };
            res.send(data);
        })
});

app.get('/search/movies', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                search.searchMovieImdb(req, res, callback);
            },
            function (callback) {
                var nameMovie = req.query.q;
                nameMovie = nameMovie.replace(/ *\([^)]*\) *!/g, "");
                if (nameMovie.indexOf(':') > -1) {
                    nameMovie = nameMovie.substring(0, nameMovie.indexOf(':'));
                }
                search.searchMovieItunes(nameMovie, res, callback);
            },

        ],
        function (err, results) {

            var data = {
                'imdb': results[0],
                'itunes': results[1]
            };
            res.send(data);
        })
});


app.get('/search/tvshows/episodes', authentication.isAuthenticated, search.searchTvShowEpisode);
app.get('/search/tvshows/seasons', authentication.isAuthenticated, search.searchTvShowSeason);
app.get('/search/users', authentication.isAuthenticated, user.findByName);

app.get('/users', authentication.isAuthenticated, user.allUsers);
app.get('/users/:id', authentication.isAuthenticated, user.findById);

app.post('/follow', authentication.isAuthenticated, user.follow);
app.delete('/follow/:id', authentication.isAuthenticated, user.unfollow);

app.get('/actors/:id', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                lookup.getActorTmdb(req, res, callback);
            },

            function (callback) {
                async.waterfall([
                    function (callback) {
                        lookup.getActorTmdb(req, res, callback);
                    },

                    function (response, callback) {
                        search.searchActor(response.name, res, callback);
                    },

                ], callback);
            },
            function (callback) {
                async.waterfall([
                    function (callback) {
                        lookup.getActorTmdb(req, res, callback);
                    },

                    function (response, callback) {
                        search.searchActor(response.name, res, callback);
                    },
                    function (response, callback) {
                        lookup.getActorMovies(response.results[0].artistId, res, callback);
                    },

                ], callback);
            }

        ],
        function (err, results) {
            var profile = results[0].profile_path
            results[0].profile_path = 'https://image.tmdb.org/t/p/original' + profile;
            var data = {
                'imdb': results[0],
                'itunes': results[1],
                'movies': results[2]
            };

            res.send(data);
        })

});

app.get('/actors/:id/movies', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                lookup.getActorMovies(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'itunes': results[0],
            };
            res.send(data);
        })
});


app.get('/movies/:id', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                lookup.getMovieImdb(req, res, callback);
            },
            function (callback) {
                async.waterfall([
                    function (callback) {
                        lookup.getMovieImdb(req, res, callback);
                    },
                    function (response, callback) {
                        search.searchMovieItunes(response.imdb.title, res, callback);
                    }
                ], callback);
            },
            function (callback) {
                async.waterfall([
                    function (callback) {
                        lookup.getMovieImdb(req, res, callback);
                    },
                    function (response, callback) {
                        search.searchTrailerMovie(response.imdb.title, res, callback);
                    }

                ], callback);
            },
        ],
        function (err, results) {
            var data = {
                'imdb': results[0].imdb,
                'itunes': results[1],
                'youtube': results[2],
            };

            res.send(data);
        })
});

app.get('/series/:id', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                lookup.getSerieImdb(req, res, callback);
            },
            function (callback) {
                async.waterfall([
                    function (callback) {
                        lookup.getSerieImdb(req, res, callback);
                    },
                    function (response, callback) {
                        search.searchTvShows(response.imdb.name, res, callback);
                    }
                ], callback);
            },
            function (callback) {
                async.waterfall([
                    function (callback) {
                        lookup.getSerieImdb(req, res, callback);
                    },
                    function (response, callback) {
                        search.searchTrailerTv(response.imdb.name, res, callback);
                    }


                ], callback);
            },
            function (callback) {
                async.waterfall([
                    function (callback) {
                        lookup.getSerieImdb(req, res, callback);
                    },
                    function (response, callback) {
                        search.searchTvShows(response.imdb.name, res, callback);
                    },
                    function (response, callback) {
                        lookup.getTvShowSeason(response.results[0].artistId, res, callback);
                    },
                    function (response, callback) {
                        var datas = []
                        async.each(response.results, function (result, callback) {
                            var season = result;
                            async.series([
                                    function (callback) {
                                        lookup.getTvShowEpisodes(result.collectionId, res, callback);
                                    }
                                ],
                                function (err, results) {
                                    var data = {
                                        'tvEpisodes': results[0].results,
                                    };
                                    season["tvEpisodes"] = data.tvEpisodes;
                                    datas.push(season);
                                    console.log(datas); //réussir à sortir le datas d'ici
                                })
                            callback();
                        })
                        callback();
                    }
                ], callback);
            },
        ],
        function (err, results) {
            var data = {
                'imdb': results[0].imdb,
                'itunes': results[1],
                'youtube': results[2],
                'tvSeasons': results[3] //pour l'avoir ici
            };
            res.send(data);
        }
    )
});

app.get('/tvshows/seasons/:id', authentication.isAuthenticated, function (req, res) {

    async.series([
            function (callback) {
                lookup.getTvShowSeason(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'itunes': results[0],
            };
            res.send(data);
        })
});


app.get('/tvshows/seasons/:id/episodes', authentication.isAuthenticated, function (req, res) {
    async.series([
            function (callback) {
                lookup.getTvShowEpisodes(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'itunes': results[0],
            };
            res.send(data);
        })
});

app.get('/watchlists', authentication.isAuthenticated, watchlist.getWatchlists);
app.post('/watchlists', authentication.isAuthenticated, watchlist.createWatchlist);
app.get('/watchlists/:id', authentication.isAuthenticated, watchlist.getWatchlistById);
app.post('/watchlists/:id/movies', authentication.isAuthenticated, watchlist.addMovieToWatchlist);
app.delete('/watchlists/:id/movies/:trackId', authentication.isAuthenticated, watchlist.removeMovieFromWatchlist);
app.put('/watchlists/:id', authentication.isAuthenticated, watchlist.updateWatchlist);
app.delete('/watchlists/:id', authentication.isAuthenticated, watchlist.removeWatchlist);

// Unsecure API. Useful for the second release.

app.get('/unsecure/genres/movies', genres.getMoviesGenres);
app.get('/unsecure/genres/tvshows', genres.getTvShowsGenres);

app.get('/unsecure//search/tvshows', search.searchTvShows);
app.get('/unsecure/search/actors', search.searchActor);
app.get('/unsecure/search/movies', function (req, res) {
    async.series([
            function (callback) {
                search.searchMovieImdb(req, res, callback);
            },
            function (callback) {
                search.searchMovie(req, res, callback);
            },
        ],
        function (err, results) {
            //handle error

            //results is an array of values returned from each one
            var data = {
                'imdb': results[0],
                'itunes': results[1]
            };

            res.send(data);
        })
});

app.get('/unsecure/search/tvshows/episodes', search.searchTvShowEpisode);
app.get('/unsecure/search/tvshows/seasons', search.searchTvShowSeason);
app.get('/unsecure/search/users', user.findByName);

app.get('/unsecure/users', user.allUsers);
app.get('/unsecure/users/:id', user.findById);

app.post('/unsecure/follow', user.follow);
app.delete('/unsecure/follow/:id', user.unfollow);

app.get('/unsecure/actors/:id', lookup.getActor);
app.get('/unsecure/actors/:id/movies', lookup.getActorMovies);
app.get('/unsecure/movies/:id/:movieName', function (req, res) {
    console.log("ok");
    async.series([
            function (callback) {
                lookup.getMovieItunes(req, res, callback);
            },
            function (callback) {
                lookup.getTrailer(req, res, callback);
            }
        ],
        function (err, results) {
            var data = {
                'itunes': results[0],
                'youtube': results[1],
            };
            res.send(data);
        })
});
app.get('/unsecure/tvshows/seasons/:id', lookup.getTvShowSeason);
app.get('/unsecure/tvshows/seasons/:id/episodes', lookup.getTvShowEpisodes);

app.get('/unsecure/watchlists', watchlist.getWatchlists);
app.post('/unsecure/watchlists', watchlist.createWatchlistUnsecure);
app.get('/unsecure/watchlists/:id', watchlist.getWatchlistById);
app.post('/unsecure/watchlists/:id/movies', watchlist.addMovieToWatchlist);
app.delete('/unsecure/watchlists/:id/movies/:trackId', watchlist.removeMovieFromWatchlist);
app.put('/unsecure/watchlists/:id', watchlist.updateWatchlist);
app.delete('/unsecure/watchlists/:id', watchlist.removeWatchlistUnsecure);

var port = process.env.PORT || 3000;
app.listen(port);
