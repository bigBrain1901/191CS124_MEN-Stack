const mysql = require("mysql");
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const md5 = require("md5");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var loginID = -1;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "27021973",
    database: "irisrec"
  });

//setting up home route
app.route("/")
.get(function(_,res) {
    logout();
    res.render("index",{type:"n", text:""});
})
.post(function(req,res) {
    if (req.body.btn == "login") loginUser(req.body.rno, req.body.pwd, res);
    else addUser(req.body.rno, req.body.name, req. body.pwd, req.body.pno, res);
});

//setting up add route
app.route("/add")
.get(function(req,res) {
    if (loggedIn()) res.render("addItem");
    else res.redirect ("/");
})
.post();

//setting up auction dashboard route
app.route("/auction")
.get(function(req,res) {
    if (loggedIn()) res.render("addItem");
    else res.redirect ("/");
})
.post();

app.listen(3000);

function loggedIn() {
    if (loginID!=-1) return true;
    else return false;
}

function logout() {loginID = -1;}

function loginUser(a,b,res) {
    let sql = "select * from users where rno = \"" + a + "\" and pwd = \"" + md5(md5(b)) + "\";";
    con.connect(function(err) {
        con.query(sql, function (_, result) {
          if (result.length==0) res.render("index",{type:"f", text:"We were unable to log you in. Please check your credentials."});
          else {
            loginID = (result[0].id);
            res.redirect("/auction");
          }
        });
      });
}

function addUser(a,b,c,d, res) {
    let sql = "insert into users (rno, name, pwd, pno) values (\"" + a + "\", \"" + b + "\", \""+ md5(md5(c)) + "\", "+ d + ");";
    con.connect(function(err) {
        con.query(sql, function (error, result) {
          if (error) res.render("index",{type:"f", text:"This account already exists. Please log in instead."});
          else res.render("index",{type:"s", text:"Your account has been created. You can now login."});
        });
    });
}