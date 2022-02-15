import { Modal, Button, Alert} from 'react-bootstrap';
import {useContext, useEffect, useState } from 'react';
import {MovieContext} from '../contexts/MovieContext';
import AddForm from './AddForm';
import Pagination from './Pagination';
import Movie from './Movie.js';


const MovieList = () => {

    const {sortedMovies} = useContext(MovieContext);

    const [showAlert, setShowAlert] = useState(false);

    const [show, setShow] = useState(false);
    
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [MoviesPerPage] = useState(50)

    const handleShowAlert = () => {
        setShowAlert(true);
        setTimeout(()=> {
            setShowAlert(false);
        }, 2000)
    }

    useEffect(() => {
        handleClose();

        return () => {
            handleShowAlert();
        }
    }, [sortedMovies])

    const indexOfLastMovie = currentPage * MoviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - MoviesPerPage;
    const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPagesNum = Math.ceil(sortedMovies.length / MoviesPerPage);

    return (
    <>
    <div className="table-title">
        <div className="row">
            <div className="col-sm-6">
                <h2><b> Movies List </b></h2>
            </div>
            <div className="col-sm-6">
                <Button onClick={handleShow} className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>Add New Movie</span></Button>					
            </div>
        </div>
    </div>

    <Alert show={showAlert} variant="success">
        Movie List Updated Succefully!
    </Alert>

    <table className="table table-striped table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Movie Name</th>
                <th>Year</th>
                <th>Rank</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>

                {
                  currentMovies.map(movie => (
                      <tr key={Movie.id}>
                        <Movie movie={movie} />
                    </tr>
                  ))  
                }
                

        </tbody>
    </table>

    <Pagination pages = {totalPagesNum}
                setCurrentPage = {setCurrentPage}
                currentMovies = {currentMovies}
                sortedMovies = {sortedMovies} />

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>
                Add Movie
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AddForm />
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

export default MovieList;