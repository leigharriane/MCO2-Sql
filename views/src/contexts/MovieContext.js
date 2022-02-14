import {createContext, useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Axios from 'axios';
const mysql = require("mysql2");

export const MovieContext = createContext()

var db;

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

const MovieContextProvider  = (props) => {

    connect();

    const [data, setData] = useState ([])
    useEffect(()=>{
      Axios.get("http://localhost:3001/readAll").then((response) =>{
        console.log("ANSWER")
        setData(response.data);
        console.log(response.data)
      }).catch((err)=>{
        console.log(err);
      });
    //   console.log("hatdog");
    //   console.log(data);
    },[])

    const [movies, setMovies] = useState([])

useEffect(()=> {
    // console.log(movies);
    // setMovies(JSON.parse(localStorage.getItem('movies')))
    // console.log(movies);

    setMovies(data);
},[data])

// useEffect(() => {
//     localStorage.setItem('movies', JSON.stringify(data));
// },[])



const sortedMovies = movies.sort((a,b)=>(a.name < b.name ? -1 : 1));


const addMovie = (name, rank, year) => {
    setMovies([...movies , {id:uuidv4(), name, year, rank}])
}

const deleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id))
}

const updateMovie = (id, updatedMovie) => {
    setMovies(movies.map((movie) => movie.id === id ? updatedMovie : movie))
}

    return (
        <MovieContext.Provider value={{sortedMovies, addMovie, deleteMovie, updateMovie}}>
            {props.children}
        </MovieContext.Provider>
    )
}

export default MovieContextProvider;