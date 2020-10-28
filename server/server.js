const express = require('express');
const apiRouter = require('./routes');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

const app = express();

var cors = require('cors');
app.use(cors())


app.use(express.json());
app.use('/api/test', apiRouter);


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser());
app.use(bodyParser.json());




app.listen(process.env.PORT || '3000', () => {
	console.log(`server is running on port: ${process.env.PORT || '3000'}`);
});