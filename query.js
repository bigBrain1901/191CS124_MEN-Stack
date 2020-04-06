//jshint esversion:6
const mysql = require("mysql");
const md5 = require("md5");

//mysql connection parameters
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password_here",
    database: "irisrec"
});

//standard function to open a connection to the database
con.connect();

//this function executes a create query
//returns 1 if successful, 0 otherwise
function queryInsert(sql, cb) {
    con.query(sql, (err, _) => {
        cb((!err) ? 1 : 0);
    });
}

//this function executes a read query
//returns [objects] if successful, [] otherwise
function querySelect(sql, callback) {
    con.query(sql, (err, res) => {
        callback((!err) ? res : []);
    });
}

//this function prepares a read command
//returns the command
function makeSelect(table, condition, cb) {
    querySelect("select * from " + table + ((condition != "") ? (" where " + condition) : "") + ";", (res) => {
        cb(res);
    });
}

//this function executes a read query
//returns 1 if successful, 0 otherwise
function queryUpdate(sql, cb) {
    con.query(sql, (err, res) => {
        cb((!err) ? 1 : 0);
    });
}

//this function executes a delete query
//returns 1 if successful, 0 otherwise
function queryDelete(sql, cb) {
    con.query(sql, (err, res) => {
        if (err) console.log(err);
         cb((!err) ? 1 : 0);
    });
}

//this function prepares a create command
//returns the command
function makeInsert(table, params, cb) {
    let sql = "";
    if (table == "items") {
        sql = "insert into items (creatorid, name, description, starting_bid, deadline, contact, image, status, highest_bidder) values (";
        sql += params.loginID + ",\"" + params.name + "\",\"" + params.description + "\"," + params.starting_bid;
        sql += ",\"" + params.deadline + "\",";
        sql += (params.contact != '') ? params.contact : "0";
        sql += ",";
        sql += "\"" + params.image + "\",\"N\", " + params.loginID + ");";
    } else {
        sql = "insert into users (rno, name, pwd, pno) values (\"" + params.rno + "\", \"";
        sql += params.name + "\", \"" + md5(params.pwd) + "\", " + params.pno + ");";
    }
    queryInsert(sql, (res) => {
        cb(res);
    });
}

//this function prepares an update command
//returns the command
function makeUpdate(param, newValue, condition, cb) {
    queryUpdate("update items set " + param + " = " + newValue + " where " + condition + ";", (res) => {
        cb(res);
    });
}

//this function prepares an delete command
//returns the command
function makeDelete(table,condition,cb) {
    queryDelete("delete from " + table + " where " + condition + ";", (res) => {
        cb(res);
    });
}

exports.makeSelection = makeSelect;
exports.makeInsertion = makeInsert;
exports.makeUpdation = makeUpdate;
exports.makeDeletion = makeDelete;