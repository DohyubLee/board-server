var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var cors = require('cors')
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
app.use(cors())
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
    console.log('login',req);
    var email = req.body.email;
    var sql = `SELECT * FROM user WHERE email=?`;
    pool.query(sql, [email], (err, results) => {
        var user = results[0];
        if (err) {
            res.status(400).json({ msg: 'login failure', session: false});
        } else {
            req.session.name = user.name;
            req.session.save(() => {
                res.status(200).json({ msg: 'login success', session: true });
            })
        }
    })
})
app.get('/logout', (req, res) => {
    delete req.session.name;
    req.session.save(() => {   //save() 데이터스토어 저장이 완료되었을때 콜백함수를 실행시킨다
        res.status(200).json({ msg: 'session delete', session: false });
    })
})
app.post('/register', (req, res) => {
    console.log('register:',req);
    var user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    }
    var sql = `INSERT INTO user (email, password, name, regDate) VALUES (?, ?, ?, now())`;
    pool.query(sql, [user.email, user.password, user.name], (error, result) => {
        if (error) {
            res.status(400).json({ msg: 'register failure', session: false});
        } else {
            req.session.name = req.body.name;
            req.session.save(() => {
                res.status(200).json({ msg: 'session create', session: true });
            })
        }
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    console.log('press ctrl + c exit');
});