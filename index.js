"use strict"

const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const database = require('./db/db.js');


const app = express();
const http = require('http').Server(app);

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//api route
//const api = require('./api/api');
//app.use('/api', api);

const userApi = require('./api/user');
app.use('/api/user', userApi);

const postApi = require('./api/post');
app.use('/api/post', postApi);

const authenticationApi = require('./api/authentication');
app.use('/api/authentication', authenticationApi);


//routes -- to allow for rendering of the html pages
const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register');
const eventLog = require('./routes/eventLog');
const myEvents = require('./routes/myEvents');
const connect = require('./routes/connect');
const account = require('./routes/account');

//app using the routing paths
app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/eventLog', eventLog);
app.use('/myEvents', myEvents);
app.use('/connect', connect);
app.use('/account', account);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); //allows me to use html files for creating angular frontend pages

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/customcss', express.static(__dirname + '/includes')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/maps', express.static(__dirname + '/node_modules/ngmap/build/scripts')); // redirect JS jQuery
app.use('/angular', express.static(__dirname + '/node_modules/angular')); //redirect to angular
app.use('/angular-cookies', express.static(__dirname + '/node_modules/angular-cookies')); //redirect to angular cookies
app.use('/includes', express.static(__dirname + '/includes')); //redirect to includes for accessing header file
app.use('/public', express.static(__dirname + '/public')); //redirect to public folder for images
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); // redirect fonts
app.use('/controllers', express.static(__dirname + '/controllers')); // redirect controllers folder

var port = process.env.PORT || 3000

// const server = http.listen(3000, function(){
// 	database.connect() //connect to an instance of mongo
//     console.log('TrackR running at http://localhost:3000')
    
// })

const server = http.listen(port, function() {
    database.connect() //connect to an instance of mongo
    console.log("App is running on port " + port);
});


module.exports = app;
