import { Form, Button } from "react-bootstrap"
import {useContext, useState} from 'react';
// import {MovieContext} from '../contexts/MovieContext';

const AddForm = () =>{

    //const {addMovie} = useContext(MovieContext);

    const [newMovie, setNewMovie] = useState({
        name:"", email:"", phone:"", address:""
    });

    const onInputChange = (e) => {
        setNewMovie({...newMovie,[e.target.name]: e.target.value})
    }

    const {name, year, rank} = newMovie;

    const handleSubmit = (e) => {
        e.preventDefault();
        //addMovie(name, year, rank);
    }; return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Control
                    type="text"
                    placeholder="Name *"
                    name="name"
                    classname="form-field"
                    value={name}
                    onChange = { (e) => onInputChange(e)}
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
                    onChange = { (e) => onInputChange(e)}
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
                    onChange = { (e) => onInputChange(e)}
                />
            </Form.Group>
            <Button variant="success" type="submit" block>
                Add Movie
            </Button>
        </Form>

     )
}

export default AddForm;