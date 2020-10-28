const mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const router = require('../routes');
const express = require('express');
const app = express.Router();

const pool = mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'issue_tracker',
    host: 'localhost',
    port: '3306'
});


let mydb = {};

mydb.all = () => {

    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return reject(err);
            }

            return resolve(results);

        });

    });

};

mydb.one = (id) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM users WHERE userid = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }

            return resolve(results[0]);

        });

    });


};




module.exports = mydb;