
/**
 * Module dependencies.
 */

var express = require('express');
var expressValidator = require('express-validator');
var routes = require('./routes');
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var lessMiddleware = require('less-middleware');
var config = require('./config.js');
var Exporter = require('./Exporter.js');
var exporter = new Exporter();

var app = express();
var isDev = app.get('env') == 'development';
var cacheDuration = 2678400000; // 1 month

routes.inject(exporter);

// all environments
app.set('port', process.env.PORT || config.port);
app.set('host', process.env.HOST || config.host);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public/favicon.ico'), {maxAge: cacheDuration})); 
app.use(express.logger());
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(require('express-force-domain')(config.url));
app.use(expressValidator());
if (config.ssl) {
    app.use (function (req, res, next) {
        if (req.secure) {
            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
}
app.use(app.router);
app.use(lessMiddleware({
    src: path.join(__dirname, 'less'),
    dest: path.join(__dirname, 'public'),
    // Read views only once in prod mode.
    once: !isDev,
    // Rerender views on every view in dev mode.
    force: isDev,
    compress: true
}));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: cacheDuration}));
app.use(express.static(path.join(__dirname, '/bower_components/bootstrap/dist'), {maxAge: cacheDuration}));

// development only
if (isDev) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.index);
app.get('/status/:id', routes.status);

if (config.ssl) {

    if (config.ssl.hasOwnProperty('key')) {
        config.ssl.key = fs.readFileSync(config.ssl.key);
    }
    if (config.ssl.hasOwnProperty('cert')) {
        config.ssl.cert = fs.readFileSync(config.ssl.cert);
    }
    if (config.ssl.hasOwnProperty('ca')) {
        config.ssl.ca = fs.readFileSync(config.ssl.ca);
    }
    https.createServer(config.ssl, app).listen(config.ssl.port, config.ssl.host, function() {
        console.log('Secure express server listening on ' + config.ssl.host + ":" + config.ssl.port);
    });
}

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
    console.log('Express server listening on ' + app.get('host') + ":" + app.get('port'));
});
