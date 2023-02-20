// import logo from './logo.svg';
import './App.css';
import 'bootstrap'
import 'axios'
import Metrics from'./components/Metrics.js'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {

  return (
    <div className="App">
      <header className="App-headerr">
       
        <h1>The Metrics</h1>
        
      </header>
      <Metrics/>
    </div>
  );
}

export default App;
