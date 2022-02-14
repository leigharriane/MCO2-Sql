import {createContext, useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Axios from 'axios';

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

console.log(data);

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