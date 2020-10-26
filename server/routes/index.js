const express = require('express');
const db = require('../db');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const mysql = require('mysql');
var fs =require('fs');
const { response } = require('express');
const { rejects } = require('assert');
var cors = require('cors');
const { resolveSoa } = require('dns');


const app =express();



app.use(session({secret: "secret"}));
app.use(cors())





// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Headers','*');

//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
//         return res.status(200).json({});

//     }
//     next();

// });

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept"
    );
    next();
});


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

var sess; //session variable to track username

//login function
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

router.get('/homee', function(req, res) {

    res.send('working...');
   
});




module.exports = router;