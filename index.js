var express = require('express');
var bodyParser = require('body-parser');
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
app.use(bodyParser.json())
/****** 미들 웨어 *******/
app.get('/', (req, res) => {
    res.send('hello index');
})
app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var sql = `SELECT * FROM user WHERE email=?`;
    pool.query(sql, [email], (err, results) => {
        var user = results[0]
        if (err) {
            res.status(400).json({ msg: 'query failure'});
        } else {
            if (user) {
                console.log('email', user.email);
                if (password === user.password) {
                    res.status(200).json({ msg: 'login success', email: user.email, userNum: user.id});
                } else {
                    res.status(400).json({ msg: 'password error'});
                }
            } else {
                res.status(400).json({ msg: 'login failure'});
            }
        }
    })
})
app.post('/register', (req, res) => {
    var user = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    }
    var sql = `INSERT INTO user (email, password, name, regDate) VALUES (?, ?, ?, now())`;
    pool.query(sql, [user.email, user.password, user.name], (error, result) => {
        if (error) {
            res.status(400).json({ msg: 'email already exists.'});
        } else {
            res.status(200).json({ msg: 'register create'});
        }
    })
})
app.post('/board-insert', (req, res) => {
    var posts = {
        title: req.body.title,
        description: req.body.description,
        userNum: parseInt(req.body.userNum)
    }
    
    console.log('posts: ',posts)
    var sql = `INSERT INTO posts (title, description, user_id, saveDate) VALUES (?, ?, ?, now())`;
    pool.query(sql, [posts.title, posts.description, posts.userNum], (error, result) => {
        if (error) {
            console.log(error)
            res.status(400).json({ msg: 'query failure'});
        } else {
            res.status(200).json({ msg: 'insert success'});
        }
    })
})
app.get('/board-list', (req, res) => {
    var sql = `SELECT posts.id, posts.title, posts.saveDate, user.name FROM posts INNER JOIN user ON posts.user_id=user.id`;
    pool.query(sql, (error, results) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            console.log('results: ',results);
            res.status(200).json(results);
        }
    })
})
app.post('/board-detail', (req, res) => {
    var id = req.body.id;
    console.log('body: ', req.body);
    console.log('id: ', id);
    var sql1 = `SELECT posts.id, posts.title, posts.description, posts.saveDate, posts.user_id, user.name FROM posts INNER JOIN user ON posts.user_id=user.id WHERE posts.id=?`;
    var sql2 = `SELECT comment.id, comment.user_id, comment.description, comment.saveDate, user.name FROM comment LEFT JOIN user ON user.id=comment.user_id WHERE posts_id=?`;
    pool.query(sql1, [id], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            pool.query(sql2, [id], (error, results) => {
                if (error) {
                    console.log('error: ', error);
                    res.status(400).json({ msg: 'comment query failure'});
                } else {
                    console.log('result: ',result[0]);
                    console.log('results: ',results);
                    res.status(200).json({result: result[0], results: results});
                }
            })
        }
    })
})
app.post('/board-edit', (req, res) => {
    var id = req.body.id;
    var sql = `SELECT id, title, description FROM posts WHERE id=?`;
    pool.query(sql, [id], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            console.log('result: ',result[0]);
            res.status(200).json(result[0]);
        }
    })
})
app.post('/board-edit-save', (req, res) => {
    var sql = 'UPDATE posts SET title=?, description=?, saveDate=now() WHERE id=?'
    pool.query(sql, [req.body.title, req.body.description, req.body.id], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            console.log('result: ',result);
            res.status(200).json({ msg: 'query success', postId: req.body.id});
        }
    })
})
app.post('/user', (req, res) => {
    var id = req.body.id;
    var sql = `SELECT email, name FROM user WHERE id=?`;
    pool.query(sql, [id], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            console.log('result: ',result[0]);
            res.status(200).json(result[0]);
        }
    })
})
app.post('/usermodify', (req, res) => {
    console.log(req.body);
    var sql = 'UPDATE user SET name=?, password=?, updateDate=now() WHERE email=?'
    pool.query(sql, [req.body.name, req.body.password, req.body.email], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            console.log('result: ',result);
            res.status(200).json({ msg: 'query success'});
        }
    })
})
app.post('/userdelete', (req, res) => {
    console.log(req.body);
    var sql1 = 'SELECT * FROM user WHERE email=?'
    var sql2 = 'DELETE FROM user WHERE email=?'
    pool.query(sql1, [req.body.email], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            console.log('result: ',result[0].password);
            console.log('password: ',req.body.password);
            if (result[0].password === req.body.password) {
                pool.query(sql2, [req.body.email], (error, result) => {
                    if (error) {
                        console.log('error: ', error);
                        res.status(400).json({ msg: 'delete query failure'});
                    } else {
                        console.log('result: ',result);
                        res.status(200).json({ msg: 'account delete success'});
                    }
                })
            } else {
                res.status(400).json({ msg: 'Passwords do not match.'});
            }
        }
    })
})
app.post('/post-delete', (req, res) => {
    console.log(req.body);
    var sql = 'DELETE FROM posts WHERE id=?'
    pool.query(sql, [req.body.id], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            console.log('result: ',result);
            res.status(200).json({ msg: 'post delete success'});
        }
    })
})
app.post('/comment-insert', (req, res) => {
    console.log(req.body);
    var sql1 = `INSERT INTO comment (user_id, description, saveDate, posts_id) VALUES (?, ?, now(), ?)`;
    var sql2 = `SELECT comment.id, comment.user_id, comment.description, comment.saveDate, user.name FROM comment LEFT JOIN user ON user.id=comment.user_id WHERE posts_id=?`;
    pool.query(sql1, [req.body.curruntUser, req.body.comment, req.body.postId], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            pool.query(sql2, [req.body.postId], (error, results) => {
                if (error) {
                    console.log('error: ', error);
                    res.status(400).json({ msg: 'comment query failure'});
                } else {
                    console.log('result: ',result);
                    console.log('results: ',results);
                    res.status(200).json({ msg: 'comment insert success', results: results});
                }
            })
        }
    })
})
app.post('/comment-delete', (req, res) => {
    console.log(req.body);
    var sql1 = 'DELETE FROM comment WHERE id=?'
    var sql2 = `SELECT comment.id, comment.user_id, comment.description, comment.saveDate, user.name FROM comment LEFT JOIN user ON user.id=comment.user_id WHERE posts_id=?`;
    pool.query(sql1, [req.body.id], (error, result) => {
        if (error) {
            console.log('error: ', error);
            res.status(400).json({ msg: 'query failure'});
        } else {
            pool.query(sql2, [req.body.postId], (error, results) => {
                if (error) {
                    console.log('error: ', error);
                    res.status(400).json({ msg: 'comment query failure'});
                } else {
                    console.log('result: ',result);
                    console.log('results: ',results);
                    res.status(200).json({ msg: 'comment delete success', results: results});
                }
            })
        }
    })
})

app.listen(443, function () {
    console.log('Example app listening on port 443!');
    console.log('press ctrl + c exit');
});
