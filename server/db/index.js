const mysql = require('mysql');

const pool=mysql.createPool({
    connectionLimit:10,
    password:'',
    user:'root',
    database:'issue_tracker',
    host:'localhost',
    port:'3306'
});


let mydb={};

mydb.all = () =>{

    return new Promise((resolve,reject)=>{

        pool.query('SELECT * FROM users',(err,results)=>{
            if(err){
                return reject(err);
            }

            return resolve(results);

        });

    });

};

mydb.one = (id) => {
    return new Promise((resolve,reject)=>{

        pool.query('SELECT * FROM users WHERE userId = ?',[id],(err,results)=>{
            if(err){
                return reject(err);
            }

            return resolve(results[0]);

        });

    });


};

module.exports = mydb;