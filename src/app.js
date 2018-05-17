/**
 * @fileoverview API server app
 */

// express app
var app = require('express')();
const server = require('http').Server(app);

var bodyParser = require('body-parser');
var cors = require('cors');
const responseConfig = require('./src/middleware/response-header-setting');

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(responseConfig());

// API Routers
app.use('/', require('./api'));

module.exports = server;
