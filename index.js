const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser")
require("dotenv").config();

const app = express();

// const db = mysql.createPool({
//   host: 'transactionmanagement1.mysql.database.azure.com',
//   user: 'adminuser',
//   password: 'Password!23',
//   database: 'stadvdbmco2',
//   port: 3306,
// });

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.get("/readAll", (req, res) => {
  const sqlRead = "SELECT * FROM stadvdbmco2.movies LIMIT 10";
  db.query(sqlRead, (err, result) => {
    if (err) console.log("ERROR: "+err);
    res.send(result);
  });
});

app.post("/createNew",(req,res)=>{
    const movieName = req.body.name;
    const movieYear = req.body.year;
    const movieRank = req.body.rank;
    const sqlInsert = "INSERT INTO stadvdbmco2.movies (name, year, rank) VALUES (?,?)"
    db.query(sqlInsert,[movieName,movieYear,movieRank],(err, result)=>{
        if (err) console.log("Error: "+err);
        console.log("Success")
    })
})

app.listen(3001, () => {
  console.log("Running on port 3001");
});