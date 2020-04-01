const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//setting up home route
app.route("/")
.get(function(req,res) {
    logout();
    res.render("index");
});

//setting up add route
app.route("/add")
.get(function(req,res) {
    if (loggedIn()) res.render("addItem");
})
.post();

app.listen(3000);

function loggedIn() {
    return true;
}

function logout() {}