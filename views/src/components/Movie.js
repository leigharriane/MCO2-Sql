import {useContext, useState, useEffect} from 'react';
import {MovieContext} from '../contexts/MovieContext';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import EditForm from './EditForm'


const Movie = ({movie}) => {

   const {deleteMovie} = useContext(MovieContext)

    //const deleteMovie = (MovieContext) => {
    //Axios.delete(`http://localhost:3001/delete/${MovieContext}`);
    //};


    const [show, setShow] = useState(false);
    
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        handleClose()
    }, [Movie])


    return (
        <>
            <td>{movie.id}</td>
            <td>{movie.name}</td>
            <td>{movie.year}</td>
            <td>{movie.rank}</td>
            <td>
                <OverlayTrigger
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Edit
                        </Tooltip>
                    }>
                    <button onClick={handleShow}  className="btn text-warning btn-act" data-toggle="modal"><i className="material-icons">&#xE254;</i></button>
                </OverlayTrigger>
                <OverlayTrigger
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Delete
                        </Tooltip>
                    }>
                    <button onClick={() => deleteMovie(movie.id,movie.year)}  className="btn text-danger btn-act" data-toggle="modal"><i className="material-icons">&#xE872;</i></button>
                </OverlayTrigger>
                
            </td>

            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>
                Edit Movie
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <EditForm theMovie={movie} />
        </Modal.Body>
        <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close Button
                </Button>
        </Modal.Footer>
    </Modal>
        </>
    )
}

export default Movie;