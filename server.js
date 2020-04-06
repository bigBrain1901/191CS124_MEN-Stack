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

//port-on-system to listen on
app.listen(3000);

//app-variable
var loginID = -1;
var user = "";
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

//function for home route - HomePage
app.get("/", function (_, res) {
  res.render("index");
});

//function for login route - login Page
app.route("/login")
  .get(function (_, res) {
    logout();
    res.render("login", {
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
      text: "",
      user: user
    });
    else res.redirect("/");
  })
  .post(upload.single("image"), function (req, res) {
    if (!loggedIn()) res.redirect("/");
    else {
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
          text: "Your item has been added for auction!",
          user: user
        });
        else {
          fs.unlink(req.file.filename, (_) => {});
          res.render("addItem", {
            type: "f",
            text: "Invalid entry detected. Please check and re-enter details.",
            user: user
          });
        }
      });
    }
  });

//function for auction route - Auction Dashboard Page
app.route("/auction")
  .get(function (_, res) {
    if (loggedIn()) {
      renderAuction(res);
    } else res.redirect("/");
  });

//function for dashboard route - User Dashboard Page
app.route("/dashboard")
  .get(function (_, res) {
    if (loggedIn()) {
      let cardsToClaim;
      query.makeSelection("items", "highest_bidder = " + loginID + " and deadline < DATE(NOW()) order by status", (result) => {
        prepareArraySmall(result, (array) => {
          cardsToClaim = array;
        });
      });
      let cardsMine;
      query.makeSelection("items", "highest_bidder = " + loginID + " order by deadline", (result) => {
        prepareArray(result, (array) => {
          cardsMine = array;
        });
      });
      let cardsUploaded;
      query.makeSelection("items", "creatorID = " + loginID + " order by deadline desc", (result) => {
        prepareArrayUser(result, (array) => {
          cardsUploaded = array;
        });
      });
      setTimeout(() => {
        res.render("dashboard", {
          type: "n",
          msg: "",
          cardsToClaim: cardsToClaim,
          cardsUploaded: cardsUploaded,
          cardsMine: cardsMine,
          user: user
        });
      }, 15);
    } else res.redirect("/");
  });

//route for updatig bidding status of items
app.post("/bid/:key", function (req, res) {
  if (!loggedIn()) res.redirect("/");
  else {
    query.makeSelection("items", "id = " + req.params.key, (result) => {
      if (req.body.bid > result[0].current_bid && req.body.bid > result[0].starting_bid) {
        query.makeUpdation("current_bid", req.body.bid, "id = " + req.params.key, (_) => {});
        query.makeUpdation("highest_bidder", loginID, "id = " + req.params.key, (_) => {});
        flag = true;
        msg = "Your bid has been registered. Check dashboard for info.";
      } else {
        flag = false;
        msg = "Stop messing with the HTML!";
      }
    });
    res.redirect("/auction");
  }
});

app.post("/delete/:key", function (req, res) {
  if (!loggedIn()) res.redirect("/");
  else {
    query.makeDeletion("items", "id = " + req.params.key, () => {});
    res.redirect("/dashboard");
  }
});

app.post("/claim/:key", function (req, res) {
  if (!loggedIn()) res.redirect("/");
  else {
    query.makeUpdation("status", "\"Y\"", "id = " + req.params.key, () => {});
    res.redirect("/dashboard");
  }
});

app.get("/logout", function (_, res) {
  logout();
  res.redirect("/");
});

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
      user = result[0].name;
      res.redirect("/add");
    } else res.render("login", {
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
    if (result == 1) res.render("login", {
      type: "s",
      text: "Your account has been created. You can now login."
    });
    else res.render("login", {
      type: "f",
      text: "This account already exists or your data is invalid."
    });
  });
}

//breaking down complex page render...
function renderAuction(res) {
  query.makeSelection("items", "deadline >= DATE(NOW())", (result) => {
    if (result.length != 0) {
      prepareArray(result, (array1) => {
        query.makeSelection("items", "deadline < DATE(NOW())", (response) => {
          if (response.length != 0) {
            prepareArrayOld(response, (array2) => {
              if (flag && msg != "") res.render("auction", {
                type: "s",
                text: "Your bid has been registered. Check dashboard for info.",
                cards1: array1,
                cards2: array2,
                user: user
              });
              else if (!flag && msg != "") res.render("auction", {
                type: "f",
                text: "Stop messing with the HTML!",
                cards1: array1,
                cards2: array2,
                user: user
              });
              else res.render("auction", {
                type: "n",
                text: "",
                cards1: array1,
                cards2: array2,
                user: user
              });
              flag = false;
              msg = "";
            });
          } else res.render("auction", {
            type: "n",
            text: "",
            cards1: [],
            cards2: [],
            user: user
          });
        });
      });
    } else query.makeSelection("items", "deadline < DATE(NOW())", (response) => {
      if (response.length != 0) {
        prepareArrayOld(response, (array2) => {
          if (flag && msg != "") res.render("auction", {
            type: "f",
            text: "Your bid has been registered. Check dashboard for info.",
            cards1: [],
            cards2: array2,
            user: user
          });
          else if (!flag && msg != "") res.render("auction", {
            type: "f",
            text: "Noone has uploaded items yet. Be the first one!",
            cards1: [],
            cards2: array2,
            user: user
          });
          else res.render("auction", {
            type: "f",
            text: "Noone has uploaded items yet. Be the first one!",
            cards1: [],
            cards2: array2,
            user: user
          });
          flag = false;
          msg = "";
        });
      }
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
      description: result[i].description.substring(0, 90),
      deadline: result[i].deadline
    };
    fixText(result[i].description.length, (string) => {
      object.description += string;
    });
    array.push(object);
  }
  cb(array);
}

function fixText(x, cb) {
  let string = "";
  for (let j = 1; j < 110 - x; j++) string += "\xa0";
  cb(string);
}

function prepareArrayOld(result, cb) {
  let array = [];
  for (let i = 0; i < result.length; i++) {
    let object = {
      id: result[i].id,
      name: result[i].name,
      image: "uploads/" + result[i].image,
      currentBid: (result[i].current_bid == 0) ? result[i].starting_bid : result[i].current_bid,
      description: result[i].description.substring(0, 90),
      deadline: result[i].deadline,
      creator: "",
      highestBidder: ""
    };
    fixText(result[i].description.length, (string) => {
      object.description += string;
      getHighestBidder(result[i].highest_bidder, (response) => {
        object.highestBidder = response;
        getCreator(result[i].creatorid, (name) => {
          object.creator = name;
          array.push(object);
        });
        setTimeout(() => {
          cb(array);
        }, 100);
      });
    });
  }

}

function prepareArraySmall(result, cb) {
  let array = [];
  for (let i = 0; i < result.length; i++) {
    let object = {
      id: result[i].id,
      name: result[i].name,
      image: "uploads/" + result[i].image,
      currentBid: (result[i].current_bid == 0) ? result[i].starting_bid : result[i].current_bid,
      status: result[i].status
    };
    array.push(object);
  }
  cb(array);
}

function prepareArrayUser(result, cb) {
  let array = [];
  for (let i = 0; i < result.length; i++) {
    let object = {
      id: result[i].id,
      name: result[i].name,
      image: "uploads/" + result[i].image,
      currentBid: (result[i].current_bid == 0) ? result[i].starting_bid : result[i].current_bid,
      status: result[i].status,
      highestBidder: "",
      deadline: result[i].deadline,
      stratingBid: result[i].starting_bid
    };
    if (result[i].status == "Y") getHighestBidder(result[i].highest_bidder, (name) => {
      object.highestBidder = name;
    });

    array.push(object);
  }
  console.log(array);

  cb(array);
}

function getHighestBidder(highest_bidder, cb) {
  query.makeSelection("users", "id = " + highest_bidder, (res) => {
    cb(res[0].name);
  });
}

function getCreator(creatorID, cb) {
  query.makeSelection("users", "id = " + creatorID, (res) => {
    console.log(creatorID);
    cb(res[0].name);
  });
}