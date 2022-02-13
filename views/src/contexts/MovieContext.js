import {createContext, useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

export const MovieContext = createContext()

const MovieContextProvider  = (props) => {

    const [Movies, setMovies] = useState([
        {id:uuidv4(), name: 'Thomas Hardy10', year: 'thomashardy@mail.com', rank: '(171) 555-2222'},
        {id:uuidv4(), name: 'Dominique Perrier', year: 'dominiqueperrier@mail.com', rank: '(313) 555-5735'},
        {id:uuidv4(), name: 'Maria Anders', year: 'mariaanders@mail.com', rank: '(503) 555-9931'},
        {id:uuidv4(), name: 'Fran Wilson', year: 'franwilson@mail.com', rank: '(204) 619-5731'},
        {id:uuidv4(), name: 'Martin Blank', year: 'martinblank@mail.com', rank: '(480) 631-2097'}
])

useEffect(()=> {
    setMovies(JSON.parse(localStorage.getItem('Movies')))
},[])

useEffect(() => {
    localStorage.setItem('Movies', JSON.stringify(Movies));
})



const sortedMovies = Movies.sort((a,b)=>(a.name < b.name ? -1 : 1));



const addMovie = (name, rank, year) => {
    setMovies([...Movies , {id:uuidv4(), name, year, rank}])
}

const deleteMovie = (id) => {
    setMovies(Movies.filter(Movie => Movie.id !== id))
}

const updateMovie = (id, updatedMovie) => {
    setMovies(Movies.map((Movie) => Movie.id === id ? updatedMovie : Movie))
}

    return (
        <MovieContext.Provider value={{sortedMovies, addMovie, deleteMovie, updateMovie}}>
            {props.children}
        </MovieContext.Provider>
    )
}

export default MovieContextProvider;