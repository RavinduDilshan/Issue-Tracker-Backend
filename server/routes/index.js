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
                let role=resarray[0].userType;

            if(err){
                return rejects(err);

            }

            if(checkuser && checkpass){
              
               res.json({
                   message:'success',
                   session:sess,
                   role:role
               });
                
            }
        });

	

});

router.get('/homee', function(req, res) {

    res.send('working...');
   
});

router.get('/projects',async(req,res,next)=>{
    pool.query('SELECT * FROM projects',(err,result)=>{
        res.send(result);
    });
 });


 router.get('/cases/:id',async(req,res,next)=>{
    
    pool.query('SELECT * FROM `cases` WHERE `projectId` =?',[req.params.id],(err,result)=>{
        res.send(result);
    });
 });

 router.get('/issues/:id',async(req,res,next)=>{

    pool.query('SELECT * FROM `issues` WHERE `caseId` =?',[req.params.id],(err,result)=>{
        res.send(result);
    });

 });

 router.post('/addpro',async(req,res,next)=>{

        var projectname = req.body.projectname;
        var description = req.body.description;

        if(res){

            pool.query('INSERT INTO `projects` (`projectName` ,`description`)  VALUES (?, ?)',
            [projectname,description],(err,result)=>{
            res.send(result);
    });
            

        }

    // pool.query('INSERT INTO `projects` (`projectId`, `projectName` ,`status`, `caseCount`, `IssueCount`, `description`)  VALUES (?, ?,?,?,?,?)',
    // [null, req.body.projectname,null,null,null,req.body.description],(err,result)=>{
    //     res.send(result);
    // });

 });

 router.post('/addcase/:id',async(req,res,next)=>{

    var casename = req.body.casename;
    var description = req.body.description;
    var projid=req.params.id;

    if(res){

        pool.query('INSERT INTO `cases` (`projectId`,`description` ,`caseName`)  VALUES (?, ?,?)',
        [projid,description,casename],(err,result)=>{
        res.send(result);
});
        

    }

// pool.query('INSERT INTO `projects` (`projectId`, `projectName` ,`status`, `caseCount`, `IssueCount`, `description`)  VALUES (?, ?,?,?,?,?)',
// [null, req.body.projectname,null,null,null,req.body.description],(err,result)=>{
//     res.send(result);
// });

});

router.post('/addissue/:id',async(req,res,next)=>{

    var issuename = req.body.issuename;
    var description = req.body.description;
    var caseid=req.params.id;

    if(res){

        pool.query('INSERT INTO `issues` (`caseId`,`description` ,`issueName`)  VALUES (?, ?,?)',
        [caseid,description,issuename],(err,result)=>{
        res.send(result);
});
        

    }


});

router.get('/getissue/:id',async(req,res,next)=>{
    
    pool.query('SELECT * FROM `issues` WHERE `issueId` =?',[req.params.id],(err,result)=>{
        res.send(result);
    });
 });


 router.post('/addprojectcomment/:id',async(req,res,next)=>{

    var commenter = req.body.commenter;
    var comment = req.body.comment;
    var proid=req.params.id;

    if(res){

        pool.query('INSERT INTO `projectcomments` (`projectId`,`commenter` ,`comment`)  VALUES (?, ?,?)',
        [proid,commenter,comment],(err,result)=>{
        res.send(result);
});
        

    }


});

router.get('/getprojcomments/:id',async(req,res,next)=>{
    
    pool.query('SELECT * FROM `projectcomments` WHERE `projectId` =?',[req.params.id],(err,result)=>{
        res.send(result);
    });
 });

 
 router.post('/addcasecomment/:id',async(req,res,next)=>{

    var commenter = req.body.commenter;
    var comment = req.body.comment;
    var caseId=req.params.id;

    if(res){

        pool.query('INSERT INTO `casecomments` (`caseId`,`commenter` ,`comment`)  VALUES (?, ?,?)',
        [caseId,commenter,comment],(err,result)=>{
        res.send(result);
});
        

    }


});
 



module.exports = router;