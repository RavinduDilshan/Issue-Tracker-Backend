const express = require('express');
const db = require('../db');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const mysql = require('mysql');
var fs =require('fs');
const { response } = require('express');
const { rejects } = require('assert');

const app =express();

app.use(bodyParser());
// app.use(bodyParser.urlencoded({extended : false}));
 app.use(bodyParser.json());
 app.use(session({secret: "secret"}));

const pool=mysql.createPool({
    connectionLimit:100,
    password:'',
    user:'root',
    database:'issue_tracker',
    host:'localhost',
    port:'3306'
});



const router=express.Router();

router.get('/', async (req,res,next)=>{
    try{
        let results = await db.all();
        res.json(results);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/yo',async(req,res,next)=>{
   pool.query('SELECT * FROM users WHERE userid=1',(err,result)=>{
       res.send(result);
   });
});

var sess;
router.post('/auth',async(req,res,next)=>{
  
    //res.end(JSON.stringify(req.body));
    	var username = req.body.username;
        var password = req.body.password;
        sess=username;
       
        pool.query('SELECT * FROM users WHERE username=? AND password=?',[username,password],(err,result)=>{

                var resarray=result;
                let checkuser=resarray[0].username;
                let checkpass=resarray[0].password;

            if(err){
                return rejects(err);

            }

            if(checkuser && checkpass){
              
               res.json({
                   message:'success',
                   session:sess
               });
                
            }


            

        });

	

});

// router.get('/:id', async (req,res,next)=>{
//     try{
//         let results = await db.one(req.params.id);
//         res.json(results);
//     }
//     catch(e){
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

router.get('/homee', function(req, res) {

    res.send('working...');
   
	// if (req.session.loggedin) {
	// 	res.send('Welcome back, ' + req.session.username + '!');
	// } else {
	// 	res.send('Please login to view this page!');
	// }
	// res.end();
});

// router.post('/auth', function(request, response) {
// 	var username = request.body.username;
// 	var password = request.body.password;
// 	if (username && password) {
// 		pool.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
// 			if (results.length > 0) {
// 				request.session.loggedin = true;
// 				request.session.username = username;
// 				response.redirect('/home');
// 			} else {
// 				response.send('Incorrect Username and/or Password!');
// 			}			
// 			response.end();
// 		});
// 	} else {
// 		response.send('Please enter Username and Password!');
// 		response.end();
// 	}
// });




module.exports = router;