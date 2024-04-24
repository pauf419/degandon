import RootPage from "./page/RootPage/RootPage";
import "./styles/index.sass"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootPage/>} />
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
