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
  const sqlRead = "SELECT * FROM stadvdbmco2.movies ORDER by id DESC LIMIT 10";
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
app.get("/update/:id/:name/:year/:rank", (req, res) => {
  const prevYear = req.body.year;
  const movieName = req.params.name;
  console.log(movieName);
  const movieYear = parseInt(req.params.year);
  const movieRank = parseInt(req.params.rank);
  const movieId = req.params.id;

  console.log(prevYear);
  console.log(movieYear);

  connect();
  const sqlUpdate = "UPDATE stadvdbmco2.movies SET ? WHERE id=?"
  const body = { name: movieName, year: movieYear, rank: movieRank }
  db.query(sqlUpdate, [body, movieId], (err, result) => {
    if (err) console.log("Error: " + err);
    console.log("Success")
  })

  if (movieYear < 1980) {
    connect2();
    db.query(sqlDelete, movieId, (err, result) => {
      if (err) console.log("Error: " + err);
      console.log("Success-delete node 2")
    })

  }


  // updateMovie:  function (req, res) {
  //   connect_node1();
  //   var name = req.query.name;
  //   var year = req.query.year;
  //   var genre = req.query.genre;
  //   var director = req.query.director;
  //   var actor1 = req.query.actor1;
  //   var actor2 = req.query.actor2;

  //   console.log("update: " + editid);

  //   console.log(
  //     "helloz: " +
  //       name +
  //       " " +
  //       year +
  //       " " +
  //       director +
  //       " " +
  //       actor1 +
  //       " " +
  //       actor2
  //   );
    
  //   db.beginTransaction(function(err){
  //     if (err) console.log(err)
  //     else{
  //       if (oldyear < 1980) {
  //         connect_node2();
  //       } else if (oldyear >= 1980) {
  //         connect_node3();
  //       }
    
  //       db.query(
  //         "DELETE FROM imdb_ijs.movies WHERE id = ?",
  //         [editid],
  //         (err, movies) => {
  //           if (err) {
  //             return db.rollback(function() {
  //               throw err;
  //             })
  //           }
  //         }
  //       );
    
  //       if (year < 1980) {
  //         connect_node2();
  //       } else if (year >= 1980) {
  //         connect_node3();
  //       }
        
  //       // bale delete muna tas create nalang siya
  //       db.query(
  //         "INSERT INTO imdb_ijs.movies SET id = ?, name = ?, year = ?," +
  //           " genre = ?, director = ?, actor1 = ?, actor2 = ?",
  //         [editid, name, year, genre, director, actor1, actor2],
  //         (error, rows) => {
  //           if (error) {
  //             return db.rollback(function() {
  //               throw error;
  //           });
  //         }
  //       });

  //       connect_node1(); 
        
  //       db.query(
  //         "UPDATE imdb_ijs.movies SET name = ?, year = ?, genre = ?," +
  //           " director = ?, actor1 = ?, actor2 = ? WHERE id = ?",
  //         [name, year, genre, director, actor1, actor2, editid],
  //         (err, rows) => {
  //           if (err) {
  //             return db.rollback(function() {
  //               throw err;
  //             });
  //           }

  //           db.commit(function(err2) {
  //             if (err2) {
  //               return connection.rollback(function() {
  //                 throw err2;
  //               });
  //             }
  //             res.send("Success");
  //           });
  //         }
  //       );
  //     }
  //   }); 
  // },


  
})


//ADD MOVIE
app.post("/add/:name/:year/:rank", (req, res) => {
  const movieName = req.params.name;
  const movieYear = parseInt(req.params.year);
  const movieRank = parseInt(req.params.rank);
  const sqlMaxId = "SELECT MAX(id) as maxId FROM stadvdbmco2.movies"
  // const body = { id: id, name: movieName, year: movieYear, rank: movieRank }
  // console.log(body);
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