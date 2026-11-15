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
    /* 
      min-h-screen - makes container at least as tall as screen
      bg-slate-950 - sets background color to dark slate
      flex flex-col items-center justify-center - centers content both vertically and horizontally
    */
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      {/* text-5xl makes text large */}
      <h1 className="text-5xl font-bold text-white">
        Unlearn
      </h1>

      <p className="mt-4 text-lg text-slate-400">
        Discover what you don't know.
      </p>
    </div>
  );
}

// make component available to other files by exporting
export default App;