import { Form, Button } from "react-bootstrap"

import {MovieContext} from '../contexts/MovieContext';
import {useContext, useState} from 'react';


const EditForm = ({theMovie}) =>{

    const id = theMovie.id;
    const prevYear = theMovie.year;

    const [name, setName] = useState(theMovie.name);
    const [rank, setRank] = useState(theMovie.rank);
    const [year, setYear] = useState(theMovie.year);

    const {updateMovie} = useContext(MovieContext);

    const updatedMovie = {id, name, rank, year, prevYear}
   

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMovie(updatedMovie)
        
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
                    type="text"
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
                    type="text"
                    placeholder="Rank *"
                    name="rank"
                    classname="form-field"
                    value={rank}
                    onChange={(e)=> setRank(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="success" type="submit" block>
                Edit Movie
            </Button>
        </Form>

     )
}

export default EditForm;