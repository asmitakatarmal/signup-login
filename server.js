// basic database connectivity

const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
app.use(require("body-parser").json());
var originUrl = "http://localhost:3000"
app.use(cors({ credentials: true, origin: originUrl }));

var currentPort = 8888

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo"
});


db.connect(function (err) {
  if (err) {
    console.log("Oops..... Database Not Connected!!!!!!!!!!!");
  } else {
    console.log("Database Connected...........");
  }
});


// *********** apis section start **************


// user apis

app.post("/addNewUsers", (req, res) => {
  if (req.body.userName) {

    let post = {
      userName: req.body.userName,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: req.body.password,
      city: req.body.city,
      states: req.body.states,
      address: req.body.address,
      gender: req.body.gender,
      acceptedterms: req.body.acceptedterms
    };

    let sql = `INSERT INTO tbl_users SET ? `;
    let query = db.query(sql, [post], (err, results) => {
      if (err) { console.log("error is  : " + err) }
      res.send({ success: 1, message: "Add users successfully" });
    });

  } else {
    res.send({ success: 0, message: "Some parameter missing" });
  }
})


app.post("/viewUsers", (req, res) => {
  let id = 1
  if (id) {

    var allUsers = "";

    let sql3 = `SELECT * FROM tbl_users`;

    let query3 = db.query(sql3, (err, allUsersresults) => {
      if (err) { console.log("error is  : " + err) }
      allUsers = allUsersresults;
      var data = { allUsers };
      res.send({ success: 1, message: "allUsers Data", data });
    });

  } else {
    res.send({ success: 0, message: "Some parameter missing" });
  }
})


// login api

app.post("/userLogin", (req, res) => {
  var email = req.body.email
  var password = req.body.password

  if (email) {
    let sql3 = `SELECT * FROM tbl_users WHERE email = "` + email + `" AND password = "` + password + `" `
    console.log(sql3)

    let query3 = db.query(sql3, (err, allUsersresults) => {
      if (err) { console.log("error is  : " + err) }
      if (allUsersresults.length > 0) {
        var allUsers = allUsersresults[0];
        var data = { allUsers };
        res.send({ success: 1, message: "login.....", data });
      } else {
        res.send({ success: 0, message: "login failed....." });
      }
    });
  } else {
    res.send({ success: 0, message: "Some parameter missing" });
  }
})


// ***************** apis section end ******************

app.listen(currentPort, () => {
  console.log(`Run on frontend ${originUrl} and port : ${currentPort}`);
});