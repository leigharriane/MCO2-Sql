import React, {useState, useEffect} from "react";
import MovieList from './components/MovieList';
import EmployeeContextProvider from './contexts/EmployeeContext';
import Axios from 'axios';

function App() {

  return (
    <div className="container-xl">
      <div className="table-responsive">
        <div className="table-wrapper">
          <EmployeeContextProvider>
            <MovieList />
          </EmployeeContextProvider>
        </div>
      </div>
    </div>

  );
}

export default App;
