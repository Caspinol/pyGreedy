/**
 * Module dependencies.
 */

var express = require('express');
var engine = require( 'ejs-locals' );
var http = require('http');
var path = require('path');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');
var app = express();
var mongoose = require('mongoose');
var server = http.createServer(app);
var io = require('socket.io')(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session({
    resave: false, saveUninitialized: true,
    secret: 'SOMERANDOMSECRETHERE', cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, '/public')));

var db;

/* use test db during testing */
if ('test' == app.get('env')){
    console.log("Running test db");
    db = mongoose.connect(require('./config/database').test_db);
}else{
    db = mongoose.connect(require('./config/database').production_db);
}

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

/* root */
app.get('/', function(req, res){
    res.render('dashboard', {
	ctx: {
            title: "pyGreedy - Dashboard",
            update: null
        }
    });
});

// Numbers
require('./routes/routeNumbers')(app, { 'mongoose': mongoose, 'db': db });
// Region/Zones
require('./routes/routeRegion')(app, { 'mongoose': mongoose, 'db': db });
require('./routes/routeZone')(app, { 'mongoose': mongoose, 'db': db });
// Ratesheets
require('./routes/routeRatesheet')(app, { 'mongoose': mongoose, 'db': db });
// Account
//has to be after Ratesheet so the Ratesheet Schema is compiled first
require('./routes/routeAccount')(app, { 'mongoose': mongoose, 'db': db });
// Mediation
require('./routes/routeMediation')(app, { 'mongoose': mongoose, 'db': db });
// Rating
require('./routes/routeRating')(app, { 'mongoose': mongoose, 'db': db });
/* leave room for billing */

//Actions
require('./routes/routeActions')(app, { 'mongoose': mongoose, 'db': db });
//Settings
require('./routes/routeSettings')(app, { 'mongoose': mongoose, 'db': db });
//Imports
require('./routes/routeImport')(app, { 'mongoose': mongoose, 'db': db });


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



/* Needed for unit testing */
module.exports = server;
