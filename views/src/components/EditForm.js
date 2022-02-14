import { Form, Button } from "react-bootstrap"

import {MovieContext} from '../contexts/MovieContext';
import {useContext, useState} from 'react';
import Movie from './Movie.js';


const EditForm = ({theMovie}) =>{

    const id = theMovie.id;

    const [name, setName] = useState(theMovie.name);
    const [rank, setRank] = useState(theMovie.rank);
    const [year, setYear] = useState(theMovie.year);

    const {updateMovie} = useContext(MovieContext);

    const updatedMovie = {id, name, rank, year}
   

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMovie(id, updatedMovie)
        
    }

     return (

        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Control
                    type="text"
                    placeholder="Name *"
                    name="name"
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    required
                    
                />
            </Form.Group>
            <Form.Group>
                <Form.Control
                    type="email"
                    placeholder="Year *"
                    name="year"
                    classname="form-field"
                    value={year}
                    onChange={(e)=> setYear(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Control
                    as="textarea"
                    placeholder="Rank"
                    rows={3}
                    name="rank"
                    classname="form-field"
                    value={rank}
                    onChange={(e)=> setRank(e.target.value)}
                />
            </Form.Group>
            <Button variant="success" type="submit" block>
                Edit Movie
            </Button>
        </Form>

     )
}

export default EditForm;