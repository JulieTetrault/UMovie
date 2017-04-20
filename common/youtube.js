var request = require('request');
var qs = require('querystring');

var searchTrailerEndPoint =  'https://www.googleapis.com/youtube/v3/search?';

exports.searchTrailer = function (parameters, res, callback) {
    queryYoutuneApi(searchTrailerEndPoint  + qs.stringify(parameters), res, callback);
};


function queryYoutuneApi(url, res, callback) {
    console.log(url);
    request({
            uri: url,
            method: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('key', 'AIzaSyBew5ya6Y4_-XBE-3vajgQbeNaPM9YbuLs');
            },
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