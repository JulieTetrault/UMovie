var request = require('request');
var qs = require('querystring');

var searchEndPoint = 'http://itunes.apple.com/search?';
var lookupEndPoint = 'http://itunes.apple.com/lookup?';

exports.search = function (parameters, res, callback) {
    queryItunesApi(searchEndPoint + qs.stringify(parameters), res, callback);
};

exports.lookup = function (parameters, res, callback, amount) {
    queryItunesApi(lookupEndPoint + qs.stringify(parameters), res, callback, amount);
};

function queryItunesApi(url, res, callback, amount) {
    request({
            uri: url,
            method: 'GET'
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                successCallback(JSON.parse(body), callback, amount);
            } else {
                errorCallback(res, error, response, body);
            }
        }
    );
}


function successCallback(body,callback, amount) {
    if (amount == 'many') {
        body.results.splice(0,1);
        body.resultCount--;
        callback(null, body);
    }
    else {
        callback(null, body);
    }
}

function errorCallback(res, error, response, body) {
    console.error(error, body);
    res.status(response.statusCode).send(body);
}
