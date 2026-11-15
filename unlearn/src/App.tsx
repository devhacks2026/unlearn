// main react component named App
import { useState } from "react";
function App() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="layout">

      <aside className={isOpen ? "sidebar" : "sidebar collapsed"}>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "←" : "→"}
        </button>
        
        <h1 className="logo">unlearn.</h1>

        <div className="nav-item active">
          Home
        </div>

        <div className="nav-item">
          + New subject
        </div>

        <div className="subjects">
          <p className="menu-label">YOUR SUBJECTS</p>
          <div className="nav-item"> Math</div>
          <div className="nav-item"> Chemistry</div>
          <div className="nav-item"> Programming</div>
        </div>

      </aside>

      <h1>Unlearn</h1>
      <p>An AI study companion that helps students discover when their knowledge is incomplete or incorrect.</p>
    </div>
  );
}

// make component available to other files by exporting
export default App;