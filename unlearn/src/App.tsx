// main react component named App
function App() {
  return (
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