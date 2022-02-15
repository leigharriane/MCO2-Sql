import {createContext, useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Axios from 'axios';
const mysql = require("mysql2");

export const MovieContext = createContext()


const MovieContextProvider  = (props) => {

    const [data, setData] = useState ([])
    useEffect(()=>{
        Axios.get("http://localhost:3001/readAll").then((response) =>{
        console.log("ANSWER")
        setData(response.data);
        console.log(response.data)
      }).catch((err)=>{
        console.log(err);
      });
      console.log("hatdog");
      console.log(data);
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


const sortedMovies = movies;

// const addMovie = (name, rank, year) => {
//     setMovies([...movies , {id:uuidv4(), name, year, rank}])
// }

const addMovie = (name, year, rank) => {
    alert(`Movie id: ${id} Created`);
    window.location = '/' // i.e. window.location='default.aspx'
    console.log(name);
    console.log(year);
    console.log(rank);
    Axios.post(`http://localhost:3001/add/${name}/${year}/${rank}`);
 }

/*const deleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id))
}*/


const deleteMovie = (id, year) => {
    alert(`Movie id: ${id} Deleted`);
    window.location = '/' // i.e. window.location='default.aspx'

    console.log(id);
    console.log(year);
    console.log("hi");
    console.log(data);
    //console.log(data.id);//undefined
    //setMovies(movies.filter(movie => movie.id !== id))
    Axios.delete(`http://localhost:3001/delete/${id}/${year}`);
    //window.location.reload();
    //setMovies(data);//not sure ano ginagawa neto
};


/*
const updateMovie = (id, updatedMovie) => {
    console.log(id);
    console.log(updatedMovie)
    console.log(updatedMovie.name)
    console.log(updatedMovie.year)
    console.log(updatedMovie.rank)
    //setMovies(movies.map((data) => data.id === id ? updatedMovie : data))
    Axios.put(`http://localhost:3001/update/${id}/${updatedMovie.name}/${updatedMovie.year}/${updatedMovie.rank}`);
    //app.put("/update/:id/:updateMovie.name/:updateMovie.year/:updateMovie.rank",(req,res)=>{
    setMovies(data);//not sure ano ginagawa neto

}*/

const updateMovie = (updatedMovie) => {
    //console.log(id);
    //const name = req.body.name
    console.log(updatedMovie.id)
    console.log(updatedMovie.name)
    console.log(updatedMovie.year)
    console.log(updatedMovie.rank)
    //setMovies(movies.map((data) => data.id === id ? updatedMovie : data))
    Axios.get(`http://localhost:3001/update/${updatedMovie.id}/${updatedMovie.name}/${updatedMovie.year}/${updatedMovie.rank}`);
    //app.put("/update/:id/:updateMovie.name/:updateMovie.year/:updateMovie.rank",(req,res)=>{
    //setMovies(data);//not sure ano ginagawa neto

}


    return (
        <MovieContext.Provider value={{sortedMovies, addMovie, deleteMovie, updateMovie}}>
            {props.children}
        </MovieContext.Provider>
    )
}

export default MovieContextProvider;