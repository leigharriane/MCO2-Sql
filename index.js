const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser")
require("dotenv").config();

const app = express();

var db;

// const db = mysql.createPool({
//   host: 'transactionmanagement1.mysql.database.azure.com',
//   user: 'adminuser',
//   password: 'Password!23',
//   database: 'stadvdbmco2',
//   port: 3306,
// });

function connect() {
  db = mysql.createPool({
    host: 'transactionmanagement1.mysql.database.azure.com',
    user: 'adminuser',
    password: 'Password!23',
    database: 'stadvdbmco2',
    port: 3306,
  });
}

function connect2() {
  db = mysql.createPool({
    host: 'transactionmanagement.mysql.database.azure.com',
    user: 'adminuser',
    password: 'Password!23',
    database: 'stadvdbmco2',
    port: 3306,
  });
}

function connect3() {
  db = mysql.createPool({
    host: 'transactionmanagementlino.mysql.database.azure.com',
    user: 'adminuser',
    password: 'Password!23',
    database: 'stadvdbmco2',
    port: 3306,
  });
}

connect(); //change to your node

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get("/readAll", (req, res) => {
  const sqlRead = "SELECT * FROM stadvdbmco2.movies ORDER by id DESC LIMIT 1000";
  connect(); //change to your node
  db.query(sqlRead, (err, result) => {
    if (err) console.log("ERROR: " + err);
    res.send(result);
    console.log(result);
  });
});

/*
app.post("/createNew",(req,res)=>{
    const movieName = req.body.name;
    const movieYear = req.body.year;
    const movieRank = req.body.rank;
    const sqlInsert = "INSERT INTO stadvdbmco2.movies (name, year, rank) VALUES (?,?)"
    db.query(sqlInsert,[movieName,movieYear,movieRank],(err, result)=>{
        if (err) console.log("Error: "+err);
        console.log("Success")
    })
})*/

app.get("/kyle", (req, res) => {
  res.send("hellokyle")
})


//DELETE
app.delete("/delete/:id/:year", (req, res) => {
  const movieId = req.params.id
  const movieYear = req.params.year
  const sqlDelete = "DELETE FROM stadvdbmco2.movies WHERE id = ?"

  connect()
  db.query(sqlDelete, movieId, (err, result) => {
    if (err) console.log("Error: " + err);
    console.log("Success-dlete node 1")
  })

  if (movieYear < 1980) {
    connect2()
    db.query(sqlDelete, movieId, (err, result) => {
      if (err) console.log("Error: " + err);
      console.log("Success-delete node 2")
    })
  } else {
    connect3()
    db.query(sqlDelete, movieId, (err, result) => {
      if (err) console.log("Error: " + err);
      console.log("Success-delete node 3")
    })
  }

})


//UPDATE
app.get("/update/:id/:name/:year/:rank/:prevYear", (req, res) => {
  const prevYear = parseInt(req.params.prevYear);
  const movieName = req.params.name;
  console.log(movieName);
  const movieYear = parseInt(req.params.year);
  const movieRank = parseInt(req.params.rank);
  const movieId = req.params.id;
  var addnode = 0;
  var deletenode = 0;

  const sqlDelete = "DELETE FROM stadvdbmco2.movies WHERE id = ?"
  const sqlInsert = "INSERT INTO stadvdbmco2.movies SET ?"
  const newbody = { id: movieId, name: movieName, year: movieYear, rank: movieRank }

  connect();
  const sqlUpdate = "UPDATE stadvdbmco2.movies SET ? WHERE id=?"
  const body = { name: movieName, year: movieYear, rank: movieRank }
  db.query(sqlUpdate, [body, movieId], (err, result) => {
    if (err) console.log("Error: " + err);
    console.log("Success Updated Central Node!")
  })

  if (prevYear < 1980) {
    connect2();
    deletenode = 2;
  } else if (prevYear >= 1980) {
    connect3();
    deletenode = 3;
  }

  db.query(sqlDelete, movieId, (err, result) => {
    if (err) console.log("Error: " + err);
    console.log("Success - deleted node " + deletenode);
  })

  if (movieYear < 1980) {
    connect2();
    addednode = 2;
  } else if (movieYear >= 1980) {
    connect3();
    addednode = 3;
  }

  db.query(sqlInsert, newbody, (err, result) => {
    if (err) console.log("Error: " + err);
    console.log("Success - added node " + addednode);
  })

    
 

  
})


//ADD MOVIE
app.post("/add/:name/:year/:rank", (req, res) => {
  const movieName = req.params.name;
  const movieYear = parseInt(req.params.year);
  const movieRank = parseInt(req.params.rank);
  const sqlMaxId = "SELECT MAX(id) as maxId FROM stadvdbmco2.movies"
  const sqlInsert = "INSERT INTO stadvdbmco2.movies SET ?"

  console.log(movieName);
  console.log(movieYear);
  console.log(movieRank);

  connect()
  
  db.query(sqlMaxId, (err, result) => {
    if (err) console.log("Error query: " + err);
    else {
      let newId = result[0].maxId + 1;
      console.log("result", result[0].maxId);
      console.log("newId", newId);
      let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }
      
      connect()
      db.query(sqlInsert, newbody, (err, result) => {
        if (err) console.log("Error: " + err);
        console.log("Success - added node 1")
      })

      if (movieYear < 1980) {
        connect2()
        db.query(sqlInsert, newbody, (err, result) => {
          if (err) console.log("Error: " + err);
          console.log("Success - added node 2")
        })
      } else {
        connect3()
        db.query(sqlInsert, newbody, (err, result) => {
          if (err) console.log("Error: " + err);
          console.log("Success -  added node 3", newbody)
        })
      }

    }
  })
})




app.listen(3001, () => {
  console.log("Running on port 3001");
});