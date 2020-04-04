//jshint esversion:6
//import section...
const fs = require("fs");
const express = require("express");
const app = express();
const ejs = require("ejs");
const md5 = require("md5");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const query = require(__dirname + "/query");

//environment setup section...
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//app-variable
var loginID = -1;
var flag = false;
var msg = "";

//multer image-upload strategy
var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (_, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (_, file, cb) => {
  if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') cb(null, true);
  else cb(new encodeURI("/add"), false);
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//---------------------------------------------------------------------------------------------
//SERVER ROUTING STARTS NOW...

//function for home route - login Page
app.route("/")
  .get(function (_, res) {
    logout();
    res.render("index", {
      type: "n",
      text: ""
    });
  })
  .post(function (req, res) {
    if (req.body.btn == "login") loginUser(req.body.rno, req.body.pwd, res);
    else registerUser(req.body.rno, req.body.name, req.body.pwd, req.body.pno, res);
  });

//function for add route - Add Items for Auction Page
app.route("/add")
  .get(function (_, res) {
    if (loggedIn()) res.render("addItem", {
      type: "n",
      text: ""
    });
    else res.redirect("/");
  })
  .post(upload.single("image"), function (req, res) {
    let params = {
      name: req.body.name,
      description: req.body.desc,
      starting_bid: req.body.starting_bid,
      deadline: req.body.deadline,
      contact: req.body.pno,
      image: req.file.filename,
      loginID: loginID
    };
    query.makeInsertion("items", params, (result) => {
      if (result == 1) res.render("addItem", {
        type: "s",
        text: "Your item has been added for auction!"
      });
      else {
        fs.unlink(req.file.filename, (err) => {});
        res.render("addItem", {
          type: "f",
          text: "Invalid entry detected. Please check and re-enter details."
        });
      }
    });
  });

//function for auction route - Auction Dashboard Page
app.route("/auction")
  .get(function (_, res) {
    if (loggedIn()) {
      query.makeSelection("items", "", (result) => {
        console.log(result);

        if (result.length != 0) renderAuction(result, res);
        else res.render("auction", {
          type: "f",
          text: "Noone has uploaded items yet. Be the first one!",
          cards: []
        });
      });
    } else res.redirect("/");
  })
  .post();

//route for updatig bidding status of items
app.post("/bid/:key", function (req, res) {
  auctionFlag = false;
  msg = "";
  query.makeSelection("items", "id = " + req.params.key, (result) => {
    if (req.body.bid > result[0].current_bid) {
      query.makeUpdation("current_bid", req.body.bid, "id = " + req.params.key, (result) => {});
      query.makeUpdation("highest_bidder", loginID, "id = " + req.params.key, (result) => {});
      flag = true;
      msg = "Your bid has been registered. Check dashboard for info.";
    } else {
      auctionFlag = false;
      msg = "Stop messing with the HTML!";
    }
  });
  res.redirect("/auction");
});

//port-on-system to listen on
app.listen(3000);

//---------------------------------------------------------------------------------------------
//OTHER DEPENDENCY FUNCTIONS...

function loggedIn() {
  if (loginID != -1) return true;
  else return false;
}

function logout() {
  loginID = -1;
}

//this function checks and logs the user in
function loginUser(rno, pwd, res) {
  query.makeSelection("users", "rno = \"" + rno + "\" and pwd = \"" + md5(pwd) + "\"", (result) => {
    if (result.length > 0) {
      loginID = result[0].id;
      res.redirect("/add");
    } else res.render("index", {
      type: "f",
      text: "We were unable to log you in. Please check your credentials."
    });
  });
}

//this function adds a new user to database
function registerUser(rno, name, pwd, pno, res) {
  query.makeInsertion("users", {
    rno: rno,
    name: name,
    pwd: pwd,
    pno: pno
  }, (result) => {
    if (result == 1) res.render("index", {
      type: "s",
      text: "Your account has been created. You can now login."
    });
    else res.render("index", {
      type: "f",
      text: "This account already exists or your data is invalid."
    });
  });
}

//breaking down complex page render...
function renderAuction(result, res) {
  prepareArray(result, (array) => {
    if (flag && msg != "") res.render("auction", {
      type: "s",
      text: "Your bid has been registered. Check dashboard for info.",
      cards: array
    });
    else if (!flag && msg != "") res.render("auction", {
      type: "f",
      text: "Stop messing with the HTML!",
      cards: array
    });
    else res.render("auction", {
      type: "n",
      text: "",
      cards: array
    });
  });
}

//breaking down complex page render... contd...
function prepareArray(result, cb) {
  let array = [];
  for (let i = 0; i < result.length; i++) {
    let object = {
      id: result[i].id,
      name: result[i].name,
      image: "uploads/" + result[i].image,
      currentBid: (result[i].current_bid == 0) ? result[i].starting_bid : result[i].current_bid,
      description: result[i].description.substring(0, 90) + ((result[i].description.length < 90) ? "" : " ..."),
      deadline: result[i].deadline,
    };
    array.push(object);
  }
  cb(array);
}