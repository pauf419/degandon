import RootPage from "./page/RootPage/RootPage";
import "./styles/index.sass"
import {
  BrowserRouter,
  Routes, 
  Route,
  Navigate
} from "react-router-dom";
import { socket } from "./websocket/socket";
import { useEffect } from "react";
 
function App() {
  useEffect(() => {
    socket.on("receive_message", (data:any) => {
      alert(data.message);
    });
  }, [socket]);
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
