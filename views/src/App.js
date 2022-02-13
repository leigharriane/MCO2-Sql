import MovieList from './components/MovieList';
import EmployeeContextProvider from './contexts/MovieContext';

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
