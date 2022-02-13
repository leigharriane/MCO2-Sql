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

    const [movies, setMovies] = useState([
        {id:uuidv4(), name: 'Thomas Hardy10', year: 'thomashardy@mail.com', rank: '(171) 555-2222'},
        {id:uuidv4(), name: 'Dominique Perrier', year: 'dominiqueperrier@mail.com', rank: '(313) 555-5735'},
        {id:uuidv4(), name: 'Maria Anders', year: 'mariaanders@mail.com', rank: '(503) 555-9931'},
        {id:uuidv4(), name: 'Fran Wilson', year: 'franwilson@mail.com', rank: '(204) 619-5731'},
        {id:uuidv4(), name: 'Martin Blank', year: 'martinblank@mail.com', rank: '(480) 631-2097'}
])

useEffect(()=> {
    // console.log(movies);
    // setMovies(JSON.parse(localStorage.getItem('movies')))
    // console.log(movies);
    setMovies(data);
},[])

useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(data));
})



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