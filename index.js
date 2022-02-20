const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser")
require("dotenv").config();
const app = express();
var limit = 100;
var db;
const port = process.env.PORT || 2020

// connections to central node, node 1 and node 3
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


connect(); //connecting to the central node

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// READ AND GET THE DATA TO THE APPLICATION


app.get("/getdata", (req, res) => {
  const sqlRead = `SELECT * FROM stadvdbmco2.movies ORDER by id  DESC LIMIT ${limit}`; // operation to read the movie database
  const readLog = 'SELECT * FROM stadvdbmco2.table_logs WHERE pass = 0';  // operation to read the logs database


  try { // when the central node is online 

    let logArray = [] // array to store all the logs 
    //get logs from central node 
    connect();
    db.query(readLog, (err, result) => {
      logArray = logArray.concat(result); // add the logs from central node to the logArray
      //get logs from node 2
      connect2();
      db.query(readLog, (err, result) => {
        logArray = logArray.concat(result); // add the logs from node2 to the logArray
      });
      // get logs from node 2
      connect3();
      db.query(readLog, (err, result) => {
        logArray = logArray.concat(result); // add the logs from node3 to the logArray
      });

      // loop log operations and implement them on the nodes that have failed 
      for (let i = 0; i < logArray.length; i++) { // for each log, its data will be saved to either operations or body

        var push_operations = {
          operation: logArray[i].operation,
          node: logArray[i].node,
          pass: logArray[i].pass
        }
        var push_body = {
          id: logArray[i].movie_id,
          name: logArray[i].movie_name,
          year: logArray[i].movie_year,
          rank: logArray[i].movie_rank
        }


        if (push_operations.node == 1 && push_operations.pass == 0) { // if the log is from the central node and failed to save before
          connect();
          db.query(push_operations.operation, push_body, (err, result) => { // will do the query depending on the operation on the log 
            console.log("node 1 success  " + push_operations.operation)
            if (err) {
              var update_log = {
                movie_id: push_body.id,
                movie_year: push_body.year,
                operation: push_operations.operation,
                node: push_operations.node,
                pass: 0 // when the log fails to be implemented, it will stay as a failed log
              }

              var update_log = {
                movie_id: push_body.id,
                movie_year: push_body.year,
                operation: push_operations.operation,
                node: push_operations.node,
                pass: 1  // if the log is successfully implemented, the log will be updated to a pass log
              }

              // checks if the movie is below or after 1980 and sets up the connection to either node 2 or node 3

              if (push_body.year < 1980) {
                connect2();
              } else {
                connect3();
              }

              //update logs either node 2 or node 3
              //implements the log according the its operation on either node 2 or node 3  
              db.query("UPDATE stadvdbmco2.table_logs SET ? WHERE movie_id = ? AND operation = ?  ", [update_log, update_log.movie_id, update_log.operation], (err, result) => {
                if (!err){}
                  // console.log("UPDATED LOG!");
              });
            }

          })
        }
        if (push_operations.node == 2 && push_operations.pass == 0) {
          connect2();
          db.query(push_operations.operation, push_body, (err, result) => {

            if (err) {
              var update_log = {
                movie_id: push_body.id,
                movie_year: push_body.year,
                operation: push_operations.operation,
                node: push_operations.node,
                pass: 0
              }
            }
            else {
              var update_log = {
                movie_id: push_body.id,
                movie_year: push_body.year,
                operation: push_operations.operation,
                node: push_operations.node,
                pass: 1
              }
            }
        
            connect();
            db.query("UPDATE stadvdbmco2.table_logs SET ? WHERE movie_id = ? AND operation = ? AND node = 2", [update_log, update_log.movie_id, update_log.operation], (err, result) => {
              if (!err)
                console.log("UPDATED LOG!");
            });

            connect2();
            console.log("node 2 success  " + push_operations.operation)
          });

        }

        if (push_operations.node == 3 && push_operations.pass == 0) {
          connect3(); // connect node 3
          db.query(push_operations.operation, push_body, (err, result) => {

            if (err) {
              var update_log = {
                movie_id: push_body.id,
                movie_year: push_body.year,
                operation: push_operations.operation,
                node: push_operations.node,
                pass: 0
              }
            }
            else {
              var update_log = {
                movie_id: push_body.id,
                movie_year: push_body.year,
                operation: push_operations.operation,
                node: push_operations.node,
                pass: 1
              }
            }
             
            connect();
            // console.log("update_log", update_log)
            // console.log("update_log.movie_id", update_log.movie_id)

            db.query("UPDATE stadvdbmco2.table_logs SET ? WHERE movie_id = ? AND operation = ? AND node = 3", [update_log, update_log.movie_id, update_log.operation], (err, result) => {
              if (!err){}
                // console.log("UPDATED LOG!");
            });

              

              //update logs from the central node
              // connect();
              // console.log("update_log", update_log)
              // console.log("update_log.movie_id", update_log.movie_id)

              // db.query("UPDATE stadvdbmco2.table_logs SET ? WHERE movie_id = ? AND operation = ? AND node = 1", [update_log, update_log.movie_id, update_log.operation], (err, result) => {
              //   if (!err)
              //     console.log("UPDATED LOG!");
              // });
              // connect3();

              // console.log("node 3 success  " + push_operations.operation)
            
          });
        };
      };

      connect(); // connects to the central log 
      db.query(sqlRead, (err, result) => { // reads all the movie data from the movies databasse
        if (err) console.log("ERROR: " + err);
        // result.sort((a, b) => (a.id < b.id ? 1 : b.id < a.id ? -1 : 0));
        res.send(result); // sends the result to the application
      });
    })
    // console.log(logArray[0])


  } catch (error) { // if the central node fails

    let movies = []; // array to save the movies from node 2 and node 3

    connect2();
    db.query(sqlRead, (err, result) => {
      if (err) console.log("NODE 2 ERROR: " + err);
      movies = movies.concat(result); // adds the movie from node 2 to the array

      connect3();
      db.query(sqlRead, (err, result) => {
        if (err) console.log("NODE 3 ERROR: " + err);
        movies = movies.concat(result);  // adds the movie from node 3 to the array
        movies.sort((a, b) => (a.id < b.id ? 1 : b.id < a.id ? -1 : 0));  // sorts the movies in the array 
        res.send(movies); // sends the data to the application
      });
    });
  }
});

app.get("/addData", (req, res) => { // loads more data
  limit += 100;
});

//DELETES ThE ROW 
app.delete("/delete/:id/:year", (req, res) => {

  // gets the movie Id and the Year of the movie row to be deleted
  const movieId = req.params.id
  const movieYear = req.params.year
  const sqlDelete = "DELETE FROM stadvdbmco2.movies WHERE id = ?" // delete operation
  const log = "INSERT INTO stadvdbmco2.table_logs SET ?"
  var nodenum = 0
  var passnum = -1

  try { // when central node is up
    connect() // connects to the main node

    // deletes the movie from the mocie database with the  same movie id in the central node

    db.query(sqlDelete, movieId, (err, result) => {
      if (err) console.log("Error: " + err);
      console.log("Success-delete node 1")
    })

    nodenum = 1;
    passnum = 1;
    let logbody = { movie_id: movieId, movie_year: movieYear, operation: sqlDelete, node: nodenum, pass: passnum }
    console.log("logbody", logbody);
    db.query(log, logbody, (err, result) => {
      console.log("Success - added log - central delete passed")
    })

    if (movieYear < 1980) { // when movie is below 1980 it will now connect to node 2
      connect2()

      // deletes the movie from the mocie database with the same movie id in node 2

      db.query(sqlDelete, movieId, (err, result) => { 
        if (err) {
          connect();
          nodenum = 2
          passnum = 0
          db.query(log, logbody, (err, result) => {
            console.log("Success - added log node 2") // adds a failed log in the central node
          })
          console.log("Error: " + err);

        }

        nodenum = 2
        passnum = 1
        let logbody = { movie_id: movieId, movie_year: movieYear, operation: sqlDelete, node: nodenum, pass: passnum }
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log - delete node 2")  // adds a success log in the central node
        })

      })

    } else {
      connect3() // when movie is  equal or greater than 1980

      // deletes the movie from the mocie database with the same movie id in node 2

      db.query(sqlDelete, movieId, (err, result) => {
        if (err) {
          connect();
          nodenum = 3
          passnum = 0
          db.query(log, logbody, (err, result) => {
            console.log("Success - added log node 2")  // adds a failed log to the central node when node 3 is down
          })
          console.log("Error: " + err);
        }
        console.log("Success-delete node 3")

        nodenum = 3
        passnum = 1
        let logbody = { movie_id: movieId, movie_year: movieYear, operation: sqlDelete, node: nodenum, pass: passnum }
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log - delete node 3")
        })


      })

     
    }

  } catch (error) {

    // cannot connect to central node 

    if (movieYear < 1980) {
      connect2()
      nodenum = 1;
      passnum = 0;
      let logbody = { movie_id: movieId, movie_year: movieYear, operation: sqlDelete, node: nodenum, pass: passnum }
      console.log("logbody", logbody);
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log - central delete failed")
      })
      db.query(sqlDelete, movieId, (err, result) => {
        if (err) console.log("Error: " + err);
      })
      console.log("Success-delete node 2")
      nodenum = 2
      passnum = 1
      logbody = { movie_id: movieId, movie_year: movieYear, operation: sqlDelete, node: nodenum, pass: passnum }
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log - delete node 2 ")
      })
    } else {
      connect3()
      nodenum = 1
      passnum = 0
      let logbody = { movie_id: movieId, movie_name: "", movie_year: movieYear, movie_rank: "", operation: sqlDelete, node: nodenum, pass: passnum }
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log - central delete failed")
      })

      db.query(sqlDelete, movieId, (err, result) => {
        if (err) console.log("Error: " + err);
        console.log("Success-delete node 3")
        nodenum = 3
        passnum = 1
        logbody = { movie_id: movieId, movie_year: movieYear, operation: sqlDelete, node: nodenum, pass: passnum }
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log - delete")
        })

      })
    }
  }
})

//UPDATE
app.get("/update/:id/:name/:year/:rank/:prevYear", (req, res) => {
  // gets all the data from the movie 
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
  const log = "INSERT INTO stadvdbmco2.table_logs SET ?"
  var nodenum = 0
  var passnum = -1

  try { // when there is connection to the central node
    connect();
    nodenum = 1;
    passnum = 1;
    const sqlUpdate = "UPDATE stadvdbmco2.movies SET ? WHERE id=?"
    const body = { name: movieName, year: movieYear, rank: movieRank }
    let logbody = { movie_id: movieId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlUpdate, node: nodenum, pass: passnum }
    db.query(sqlUpdate, [body, movieId], (err, result) => { // updates the movie data based on the movie name, year and rank to the central node 
      if (err) console.log("Error: " + err); 
      console.log("Success Updated Central Node!")
    })
    db.query(log, logbody, (err, result) => {
      console.log("Success - added log central")
    })

    if (prevYear < 1980) {
      nodenum = 2
      passnum = 1
      connect2();
      deletenode = 2;
    } else if (prevYear >= 1980) {
      nodenum = 3
      passnum = 1
      connect3();
      deletenode = 3;
    }

    db.query(sqlDelete, movieId, (err, result) => { // deletes the movie data from either node 2 or node 3
      if (err) {
        connect();
        passnum = 0
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log node 2")
        })
        console.log("Error: " + err);
      }
      console.log("Success - deleted node " + deletenode);
    })



    logbody = { movie_id: movieId, movie_name: movieName, movie_year: prevYear, movie_rank: movieRank, operation: sqlDelete, node: nodenum, pass: passnum }
    db.query(log, logbody, (err, result) => {
      console.log("Success - added log node 2")
    })

    if (movieYear < 1980) {
      nodenum = 2
      passnum = 1
      connect2();
      addednode = 2;
    } else if (movieYear >= 1980) {
      nodenum = 3
      passnum = 1
      connect3();
      addednode = 3;
    }

    db.query(sqlInsert, newbody, (err, result) => {  // adds the updated movie data to either node 2 or 3 depending on the movie's year
      if (err) {
        connect();
        passnum = 0
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log node 2")
        })
        console.log("Error: " + err);
      }
      console.log("Success - added node " + addednode);
    })
    logbody = { movie_id: movieId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
    db.query(log, logbody, (err, result) => {
      console.log("Success - added log node 2")
    })

  } catch (error) { // central node is down
    nodenum = 1
    passnum = 0
    const sqlUpdate = "UPDATE stadvdbmco2.movies SET ? WHERE id=?"
    // did not connect to central node

    if (prevYear < 1980) {
      connect2();
      let logbody = { movie_id: movieId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlUpdate, node: nodenum, pass: passnum }
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log")
      })
      deletenode = 2;
      nodenum = 2
      passnum = 1
    } else if (prevYear >= 1980) {
      connect3();
      let logbody = { movie_id: movieId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlUpdate, node: nodenum, pass: passnum }
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log")
      })
      deletenode = 3;
      nodenum = 3
      passnum = 1
    }

    db.query(sqlDelete, movieId, (err, result) => {
      if (err) console.log("Error: " + err);
      console.log("Success - deleted node " + deletenode);
      let logbody = { movie_id: movieId, movie_name: movieName, movie_year: prevYear, movie_rank: movieRank, operation: sqlDelete, node: nodenum, pass: passnum }
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log")
      })
    })

    if (movieYear < 1980) {
      connect2();
      addednode = 2;
      nodenum = 2
      passnum = 1
    } else if (movieYear >= 1980) {
      connect3();
      addednode = 3;
      nodenum = 3
      passnum = 1
    }

    db.query(sqlInsert, newbody, (err, result) => {
      if (err) console.log("Error: " + err);
      console.log("Success - added node " + addednode);
      let logbody = { movie_id: movieId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
      db.query(log, logbody, (err, result) => {
        console.log("Success - added log")
      })
    })
  }
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
        db.query(sqlInsert, newbody, (err, result) => { // adds the movie to the central node 
          if (err) { console.log("Error: " + err); }
          console.log("Success - added node 1")
        })
        db.query(log, logbody, (err, result) => {
          console.log("Success - added log central")
        })

        if (movieYear < 1980) { // movie year below 1980
          connect2();
          nodenum = 2
          passnum = 1
          let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }
          let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
          db.query(sqlInsert, newbody, (err, result) => {  // adds the movie to node 2
            if (err) {
              console.log("Error: " + err);
              connect();
              nodenum = 2
              passnum = 0
              let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
              db.query(log, logbody, (err, result) => {
                console.log("Success - added log node 2")
              })
            }
            console.log("Success - added node 2")
          })
          db.query(log, logbody, (err, result) => {
            console.log("Success - added log node 2")
          })
        } else if (movieYear >= 1980){ // movie year is equal or greater than 1980
          connect3();
          nodenum = 3
          passnum = 1
          let newbody = { id: newId, name: movieName, year: movieYear, rank: movieRank }
          let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
          db.query(sqlInsert, newbody, (err, result) => {  // adds the movie to node 3
            if (err) {
              console.log("Error: " + err);
              connect();
              nodenum = 3
              passnum = 0
              let logbody = { movie_id: newId, movie_name: movieName, movie_year: movieYear, movie_rank: movieRank, operation: sqlInsert, node: nodenum, pass: passnum }
              db.query(log, logbody, (err, result) => {
                console.log("Success - added log node 3")
              })
            }
            console.log("Success -  added node 3", newbody)
          })
          db.query(log, logbody, (err, result) => {
            console.log("Success - added log node 3")
          })
        }
      }
    })

  } catch (error) { // central node is down
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


app.listen(port, () => {
  console.log("Running on port 2020");
});