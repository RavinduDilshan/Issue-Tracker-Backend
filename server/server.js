const express= require ('express');
const apiRouter=require('./routes');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

const app =express();


app.use(express.json());
app.use('/api/test',apiRouter);
// app.use('/api/auth',apiRouter);
// app.use('/api/homee',apiRouter);

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());




app.listen(process.env.PORT || '3000',()=>{
    console.log(`server is running on port: ${process.env.PORT || '3000'}`);
});