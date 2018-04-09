var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
var pool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '2ehguq',
  database : 'board',
  port : 3306
});

var app = express();
/****** 미들 웨어 *******/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'asdfw',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '2ehguq',
        database: 'board'
    })
}))
/****** 미들 웨어 *******/
app.post('/login', (req, res) => {

})
app.get('/logout', (req, res) => {

})
app.post('/register', (req, res) => {
    
})