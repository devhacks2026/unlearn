// main react component named App
import PulloutBar from './components/PulloutBar'
import './App.css'

function App() {
  
  return (
    
    <div className="app-container">
      <PulloutBar />
    </div>
  );
}

// make component available to other files by exporting
export default App;