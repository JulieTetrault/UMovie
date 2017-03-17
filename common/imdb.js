var request = require('request');
var qs = require('querystring');

var searchEndPoint = 'http://imdb.wemakesites.net/api/search?';
var lookupEndPoint = 'http://imdb.wemakesites.net/api/';

exports.search = function (parameters, res, callback) {
    queryImdbApi(searchEndPoint  + qs.stringify(parameters), res, callback);
};

exports.lookup = function (parameters, res, callback) {
    console.log("ok");
    var test = lookupEndPoint  + qs.stringify(parameters) + "?api_key=8c992c14-fde9-409e-8532-7c8d7a307f6e";
    console.log(test);
    queryImdbApi(lookupEndPoint  + qs.stringify(parameters) + "?api_key=8c992c14-fde9-409e-8532-7c8d7a307f6e", res, callback);
};


function queryImdbApi(url, res, callback) {
    request({
            uri: url,
            method: 'GET',
            crossDomain: true,
            data: {
                api_key: '8c992c14-fde9-409e-8532-7c8d7a307f6e'
            },
            dataType: 'jsonp',
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                successCallback(JSON.parse(body), callback);
            } else {
                errorCallback(res, error, response, body);
            }
        }
    );

}

function successCallback(body, callback) {
    callback(null, body);
}

function errorCallback(res, error, response, body) {
    console.error(error, body);
    res.status(response.statusCode).send(body);
}
