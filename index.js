const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser")
require("dotenv").config();

const app = express();
var limit = 100;

var db;
const port = process.env.PORT || 2020
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

// READ DATA
app.get("/getdata", (req, res) => {
  const sqlRead = `SELECT * FROM stadvdbmco2.movies ORDER by id DESC LIMIT ${limit}`;
  // CENTRAL NODE IS NOT ONLINE
  try {
    connect(); //change to your node
    db.query(sqlRead, (err, result) => {
      if (err) console.log("ERROR: " + err);
      res.send(result);
      //console.log(result);
    });

  } catch (error) {
    let movies = [];
    console.log("NOT CENTRAL NODE READ")

     connect2(); 
      db.query(sqlRead, (err, result) => {
      if (err) console.log("NODE 2 ERROR: " + err);
      movies = movies.concat(result);

      connect3(); 

      db.query(sqlRead, (err, result) => {
        if (err) console.log("NODE 3 ERROR: " + err);
        movies = movies.concat(result);
        movies.sort((a, b) => (a.id < b.id ? 1 : b.id < a.id ? -1 : 0));
        res.send(movies);
      });
    });
  }
});

app.get("/addData", (req, res) => {
 limit+=100; 
});

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
  var addednode = 0;
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
  const log = "INSERT INTO stadvdbmco2.table_logs SET ?"
  var nodenum = 0
  var passnum = -1

  try {    
    connect() // connected to central node
    nodenum = 1;
    passnum = 1;
    db.query(sqlMaxId, (err, result) => {
    if (err) console.log("Error query: " + err);
    else {
      let newId = result[0].maxId + 1;
      console.log("result", result[0].maxId);
      console.log("newId", newId);
      let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }
      let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
      db.query(sqlInsert, newbody, (err, result) => {
        if (err) console.log("Error: " + err);
        console.log("Success - added node 1")
      })
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log central")
      })

      if (movieYear < 1980) {
        connect2()
        nodenum = 2
        passnum = 1
        let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }
        let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
        db.query(sqlInsert, newbody, (err, result) => {
          if (err) console.log("Error: " + err);
          console.log("Success - added node 2")
        })
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log node 2")
        })
      } else {
        connect3()
        nodenum = 3
        passnum = 1
        let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }
        let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
        db.query(sqlInsert, newbody, (err, result) => {
          if (err) console.log("Error: " + err);
          console.log("Success -  added node 3", newbody)
        })
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log node 3")
        })
     }
   }
 })
    
  }catch(error){
    connect2() // connected to node 2
    nodenum = 1
    passnum = 0
    db.query(sqlMaxId, (err, result) => {
      if (err) console.log("Error: " + err);
      else {
        let node2Id = result[0].maxId + 1;
        connect3() // connected to node 3
        db.query(sqlMaxId, (err, result) => {
          if (err) console.log("Error: " + err);
          else {
            let node3Id = result[0].maxId + 1;
            let newId = Math.max(node2Id, node3Id);
            let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }

            if (movieYear < 1980) {
              connect2() // connected to node 2
              let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
              db.query(log, logbody, (err, result) => {
                console.log("Success - added log")
              })
              db.query(sqlInsert, newbody, (err, result) => {
                if (err) console.log("Error: " + err);
                console.log("Success NODE 2");
                nodenum = 2
                passnum = 1
                let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
                db.query(log, logbody, (err, result) => {
                  console.log("Success - added log")
                })
              });
            } else {
              connect3() // connected to node 3
              let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
              db.query(log, logbody, (err, result) => {
                console.log("Success - added log")
              })
              db.query(sqlInsert, newbody, (err, result) => {
                if (err) console.log("Error: " + err);
                console.log("Success");
                nodenum = 3
                passnum = 1
                let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
                db.query(log, logbody, (err, result) => {
                  console.log("Success - added log")
                })
              });
            }
          }
        });
      }
    });
  }
  
})

// app.post("/add/:name/:year/:rank", (req, res) => {
//   const movieName = req.params.name;
//   const movieYear = parseInt(req.params.year);
//   const movieRank = parseInt(req.params.rank);
//   const sqlMaxId = "SELECT MAX(id) as maxId FROM stadvdbmco2.movies"
//   const sqlInsert = "INSERT INTO stadvdbmco2.movies SET ?"
//   connect() 
//   db.query(sqlMaxId, (err, result) => {
//     if (err) console.log("Error query: " + err);
//     else {
//       let newId = result[0].maxId + 1;
//       console.log("result", result[0].maxId);
//       console.log("newId", newId);
//       let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }

//       connect()
//       db.query(sqlInsert, newbody, (err, result) => {
//         if (err) console.log("Error: " + err);
//         console.log("Success - added node 1")
//       })

//       if (movieYear < 1980) {
//         connect2()
//         db.query(sqlInsert, newbody, (err, result) => {
//           if (err) console.log("Error: " + err);
//           console.log("Success - added node 2")
//         })
//       } else {
//         connect3()
//         db.query(sqlInsert, newbody, (err, result) => {
//           if (err) console.log("Error: " + err);
//           console.log("Success -  added node 3", newbody)
//         })
//       }

//     }
//   })
// })



app.listen(port, () => {
  console.log("Running on port 2020");
});