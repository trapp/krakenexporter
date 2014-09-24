var KrakenClient = require('kraken-api');
var uuid = require('node-uuid');
var async = require('async');
var csv = require('fast-csv');
var Export = require('./Export.js');

function Exporter() {

    var exports = {};

    var check = function(ex, client, attempt, next) {
        console.log(ex.total, ex.trades.length);

        client.api('TradesHistory', {ofs: ex.trades.length}, function(error, data) {
            var delayNext = function() {
                setTimeout(next, 500);
            };
            if(data === null || error) {
                console.log("api error: ", error, data);
                if (error == 'EAPI:Invalid nonce') {
                    // Invalid nonce errors get usually fixed with the next request.
                    delayNext();
                } else if (error == 'EAPI:Invalid key') {
                    next(new Error('The key is not valid'));
                } else if (error == 'EGeneral:Permission denied') {
                    next(new Error('The key doesn\'t have the required permissions'));
                } else {
                    console.log("Unhandled error: " + error);
                    // We want to notify users of balance changes only.
                    // No need to throw errors at them every minute when the api is down.

                    // Try it up to 5 times per user.
                    if (attempt < 5) {
                        setTimeout(
                            function() {
                                check(ex, client, attempt + 1, next);
                            },
                            1000
                        );
                    } else {
                        delayNext();
                    }
                }
            } else {

                if (ex.total === null) {
                    ex.total = data.result.count;
                }
                for(var trade in data.result.trades) {
                    if (!data.result.trades.hasOwnProperty(trade)) {
                        continue;
                    }
                    data.result.trades[trade].tradeid = trade;
                    ex.trades.push(data.result.trades[trade]);
                }

                delayNext();
            }
        });
    };

    return {
        get: function(id) {
            return exports[id];
        },
        startExport: function(key, secret, callback) {
            var id = uuid.v4();
            var ex = new Export();
            ex.id = id;
            ex.key = key;
            ex.secret = secret;
            exports[id] = ex;

            var client = new KrakenClient(ex.key, ex.secret);

            async.whilst(
                function () {
                    return ex.total === null || ex.total > ex.trades.length;
                },
                function (callback) {
                    check(ex, client, 0, callback);
                },
                function (error) {
                    if (error) {
                        console.log(error);
                    } else {
                        csv
                            .writeToPath("./public/exports/" + ex.id + ".csv", ex.trades, {headers: true})
                            .on("finish", function() {
                                ex.finished = true;
                                ex.filename = "/public/exports/" + ex.id + ".csv";
                            });
                    }
                }
            );

            callback(null, id);
        }
    };
}

module.exports = Exporter;