import logo from "./logo.svg";
import "./App.css";
import Map from "./Map";

function App() {
  return (
    <div className="App hidden-offscreen show-onscreen">
      <header className="App-header"></header>

      <div>
        <Map /> 
      </div>
    </div>
  );
}

export default App;
