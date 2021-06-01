var mysql = require('mysql')
var config = require('../configs/config.js')
var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

let query = function(sql,values)
{
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err,connection)
        {
            if(err)
            {
                reject(err);
            }
            else 
            {
                connection.query(sql,values,(err,rows)=>{
                    if(err)
                    {
                        reject(err);
                    }
                    else 
                    {
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        })
    })
}

var users = `create table if not exists users(
    id INT(200) NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    pass VARCHAR(40) NOT NULL,
    reciever VARCHAR(100) NOT NULL,
    recport INT(200) NOT NULL,
    sender VARCHAR(100) NOT NULL,
    sendport INT(200) NOT NULL,
    PRIMARY KEY (id)
);`

var emails = `create table if not exists emails(
    id INT(200) NOT NULL AUTO_INCREMENT,
        f VARCHAR(100) NOT NULL,
        t VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        content TEXT,
        type INT(8) NOT NULL DEFAULT 0,
        uid INT(200) NOT NULL,
        moment VARCHAR(40),
        PRIMARY KEY (id),
        FOREIGN KEY (uid) REFERENCES users(id)
        ON DELETE CASCADE
);`



let createTable = function(sql){
    return query(sql, []);
}

createTable(users);
createTable(emails);

//注册用户
let insertData = function(value){
    let _sql = "insert into users(email,pass,reciever,recport,sender,sendport) values(?,?,?,?,?,?);"
    return query(_sql,value);
}

//发邮件
let insertEmail = function(value){
    let _sql = "insert into emails(f,t,title,content,type,uid,moment) values(?,?,?,?,?,?,?);"
    return query(_sql,value);
}

//通过用户和文章类型查找
let findEmailByUser = function(uid,type){
    let _sql = `SELECT * from emails where uid="${uid}" and type = "${type}"`
    return query(_sql);
}

let findEmailByEid = function(id){
    let _sql = `SELECT * from emails where id="${id}" `
    return query(_sql);
}

let findUserByEmail = function(email){
    let _sql = `SELECT * from users where email="${email}"`
    return query(_sql);
}

let UpdateEmail = function(ctext,iid){
    // UPDATE users SET recport=993 where id = 1
    let _sql = `UPDATE emails SET content = ${ctext} where id="${iid}"`
    return query(_sql);
}

let MoveEmailType = function(type,iid){
    let _sql = `UPDATE emails SET type = ${type} where id="${iid}"`
    return query(_sql);
}

//删除文章
let deleteEmail = function(id){
    let _sql =  `delete from emails where id="${id}"`
    return query(_sql); 
}

let deleteALLEmail = function(id){
    let _sql =  `delete from emails`
    return query(_sql); 
}

// 查询分页邮件
let findEmailByPage = function(uid,type,page){
    let _sql = ` select * FROM emails where uid="${uid}" and type = "${type}" limit ${(page-1)*10},10;`
    return query( _sql)
}

module.exports = {
    query,
    createTable,
    insertData,
    insertEmail,
    UpdateEmail,
    findEmailByPage,
    findEmailByUser,
    deleteEmail,
    findUserByEmail,
    findEmailByEid,
    MoveEmailType,
    deleteALLEmail,
}
