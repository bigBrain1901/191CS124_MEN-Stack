//import section...
const mysql = require("mysql");
const express = require("express");
const app = express();
const ejs = require("ejs");
const md5 = require("md5");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");

//environment setup section...
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//app-variable
var loginID = -1;

//mysql connection parameters
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "27021973",
  database: "irisrec"
});

//multer storage parameters - image-upload handler
var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (_, file, cb) {
    cb (null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype=='image/jpg' || file.mimetype=='image/jpeg' || file.mimetype=='image/png' || file.mimetype=='image/jpg') cb (null,true);
  else cb (new alert("Invalid filetype..."), false);
}


//upload strategy for images
const upload = multer({
  storage: storage,
  limits:{
    fileSize: 1024*1024*5
  },
  fileFilter: fileFilter
});
//---------------------------------------------------------------------------------------------
//SERVER ROUTING STARTS NOW...

//function for home route - login Page
app.route("/")
  .get(function(_,res) {
    logout();
    res.render("index",{type:"n", text:""});
  })
  .post(function(req,res) {
    if (req.body.btn == "login") loginUser(req.body.rno, req.body.pwd, res);
    else registerUser(req.body.rno, req.body.name, req. body.pwd, req.body.pno, res);
  });

//function for add route - Add Items for Auction Page
app.route("/add")
  .get(function(_,res) {
    if (loggedIn()) res.render("addItem",{type:"n", text:""});
    else res.redirect("/");
  })
  .post(upload.single("image"), function(req,res) {
    let params = {
      name: req.body.name,
      description: req.body.desc,
      starting_bid: req.body.starting_bid,
      deadline: req.body.deadline,
      contact: req.body.pno,
      image: req.file.filename
    };
    let sql = sqlInsert("items", params);
    
    con.connect(function(_) {
      con.query(sql, function (error,_) {
        if (!error) res.render ("addItem",{type:"s", text:"Your item has been added for auction!"});
        else res.render("addItem",{type:"f", text:"Invalid entry detected. Please check and re-enter details."});
      });
    });
  });

//function for auction route - Auction Dashboard Page
app.route("/auction")
  .get(function(req,res) {
    if (loggedIn()) res.redirect("auction");
    else res.redirect ("/");
  })
  .post();

//port-on-system to listen on
app.listen(3000);


//---------------------------------------------------------------------------------------------
//OTHER DEPENDENCY FUNCTIONS...

function loggedIn() {
  if (loginID!=-1) return true;
  else return false;
}

function logout() {
  loginID = -1;
}

function sqlUpdate (param, newValue, condition) {
  //works only for items table
  //construction of sql command
  return "update items set " +param+ " = " +newValue+ "where " +condition+ ";";
}

function sqlInsert (table, params) {
  //construction of sql command - looks ugly
  let sql = "";
  if (table == "items") {
    sql = "insert into items (creatorid, name, description, starting_bid, deadline, contact, image, status) values (";
    sql += loginID +",\""+ params.name +"\",\""+ params.description +"\","+ params.starting_bid;
    sql += ",\""+ params.deadline +"\",";
    sql += (params.contact != '') ? params.contact : "0";
    sql += ",";
    sql += "\""+ params.image +"\",\"N\");";
  } else {
    sql = "insert into users (rno, name, pwd, pno) values (\"" + params.rno + "\", \"";
    sql += params.name + "\", \""+ md5(md5(params.pwd)) + "\", "+ params.pno + ");";
  }
  return sql;
}

function sqlSelect (table, condition) {
  //construction of sql command
  return "select * from " +table+ " where " +condition+ ";";
}

function loginUser(rno,pwd,res) {
  con.connect(function(_) {
    let sql = sqlSelect("users", "rno = \"" + rno + "\" and pwd = \"" + md5(md5(pwd)) + "\"");
    con.query(sql, function (error,result) {
      if (!error && result.length!=0) {
        loginID = result[0].id;
        res.redirect("/add");
      } else res.render("index",{type:"f", text:"We were unable to log you in. Please check your credentials."});
    });
  });
}

function registerUser(rno,name,pwd,pno,res) {
  let result = sqlInsert("users", {
    rno: rno,
    name: name,
    pwd: pwd,
    pno: pno
  });
  con.connect(function(_) {
    con.query(result, function (error,_) {
      if (!error) res.render("index",{type:"s", text:"Your account has been created. You can now login."});
      else res.render("index",{type:"f", text:"This account already exists or your data is invalid."});
    });
  });
}