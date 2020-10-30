const express = require('express');
const db = require('../db');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const mysql = require('mysql');
var fs = require('fs');
const { response } = require('express');
const { rejects } = require('assert');
var cors = require('cors');
const { resolveSoa } = require('dns');


const app = express();



app.use(session({ secret: "secret" }));
app.use(cors())


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept"
    );
    next();
});


//mysql connection
const pool = mysql.createPool({
    connectionLimit: 100,
    password: '',
    user: 'root',
    database: 'issue_tracker',
    host: 'localhost',
    port: '3306'
});


const router = express.Router();


//root
router.get('/', async (req, res, next) => {
    try {
        let results = await db.all();
        res.json(results);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



var sess; //session variable to track username


//login function
router.post('/auth', async (req, res, next) => {

    var username = req.body.username;
    var password = req.body.password;
    sess = username;

    pool.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, result) => {

        var resarray = result;
        let checkuser = resarray[0].username;
        let checkpass = resarray[0].password;
        let role = resarray[0].userType;

        if (err) {
            return rejects(err);

        }

        if (checkuser && checkpass) {

            res.json({
                message: 'success',
                session: sess,
                role: role
            });

        }
    });



});

// GET Requests


//get project list
router.get('/projects', async (req, res, next) => {
    pool.query('SELECT * FROM projects', (err, result) => {
        res.send(result);
    });
});


//get cases from project id
router.get('/cases/:id', async (req, res, next) => {
    pool.query('SELECT * FROM `cases` WHERE `projectId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});


//get issues from case id
router.get('/issues/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `issues` WHERE `caseId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });

});


//get single issue
router.get('/getissue/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `issues` WHERE `issueId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});


//get all comments in projects
router.get('/getprojcomments/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `projectcomments` WHERE `projectId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});


//get all comments in case
router.get('/getcasecomments/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `casecomments` WHERE `caseId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});


//get all comments in case
router.get('/getcasecomments/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `casecomments` WHERE `caseId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});

//get all comments in issues
router.get('/getissuecomments/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `issuecomments` WHERE `issueId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});


//get single project comment
router.get('/getprojectcomment/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `projectcomments` WHERE `projectcmtId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});

//get all project comments reply from commentid
router.get('/getallprojectcommentsreplies/:id', async (req, res, next) => {

    pool.query('SELECT * FROM `projectcommentsreply` WHERE `commentId` =?', [req.params.id], (err, result) => {
        res.send(result);
    });
});








//POST Requests

//add new project
router.post('/addpro', async (req, res, next) => {

    var projectname = req.body.projectname;
    var description = req.body.description;

    if (res) {

        pool.query('INSERT INTO `projects` (`projectName` ,`description`)  VALUES (?, ?)',
            [projectname, description], (err, result) => {
                res.send(result);
            });


    }

});


//add case to project
router.post('/addcase/:id', async (req, res, next) => {

    var casename = req.body.casename;
    var description = req.body.description;
    var projid = req.params.id;

    if (res) {

        pool.query('INSERT INTO `cases` (`projectId`,`description` ,`caseName`)  VALUES (?, ?,?)',
            [projid, description, casename], (err, result) => {
                res.send(result);
            });


    }

});


//add issue to case
router.post('/addissue/:id', async (req, res, next) => {

    var issuename = req.body.issuename;
    var description = req.body.description;
    var caseid = req.params.id;

    if (res) {

        pool.query('INSERT INTO `issues` (`caseId`,`description` ,`issueName`)  VALUES (?, ?,?)',
            [caseid, description, issuename], (err, result) => {
                res.send(result);
            });


    }


});


//add comment to project
router.post('/addprojectcomment/:id', async (req, res, next) => {

    var commenter = req.body.commenter;
    var comment = req.body.comment;
    var proid = req.params.id;

    if (res) {

        pool.query('INSERT INTO `projectcomments` (`projectId`,`commenter` ,`comment`)  VALUES (?, ?,?)',
            [proid, commenter, comment], (err, result) => {
                res.send(result);
            });


    }


});

//add reply to project comment
router.post('/addprojectcommentreply/:id', async (req, res, next) => {

    var reply=req.body.reply;
    var commentId=req.params.id;



      

    if (res) {

        pool.query('INSERT INTO `projectcommentsreply` (`commentId`,`relply`)  VALUES (?, ?)',
            [commentId, reply], (err, result) => {
                res.send(result);
            });


    }



   

    

});




//add comment to case
router.post('/addcasecomment/:id', async (req, res, next) => {

    var commenter = req.body.commenter;
    var comment = req.body.comment;
    var caseId = req.params.id;

    if (res) {

        pool.query('INSERT INTO `casecomments` (`caseId`,`commenter` ,`comment`)  VALUES (?, ?,?)',
            [caseId, commenter, comment], (err, result) => {
                res.send(result);
            });


    }


});




//add comment to issue
router.post('/addissuecomment/:id', async (req, res, next) => {

    var commenter = req.body.commenter;
    var comment = req.body.comment;
    var issueId = req.params.id;

    if (res) {

        pool.query('INSERT INTO `issuecomments` (`issueId`,`commenter` ,`comment`)  VALUES (?, ?,?)',
            [issueId, commenter, comment], (err, result) => {
                res.send(result);
            });


    }


});

module.exports = router;