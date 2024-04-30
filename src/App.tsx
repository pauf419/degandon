import RootPage from "./page/RootPage/RootPage";
import "./styles/index.sass"
import {
  BrowserRouter,
  Routes, 
  Route,
  Navigate
} from "react-router-dom";
import { socket } from "./websocket/socket";
import { useContext, useEffect } from "react";
import VotePage from "./page/VotePage/VotePage";
import AdminPage from "./page/AdminPage/AdminPage";
import { ctx } from ".";
 
function App() {
  const {store} = useContext(ctx)
  useEffect(() => {
    if(localStorage.getItem("voted")) {
      store.setVoted(true)
    }
  },[])

  useEffect(() => {
    socket.on("nsconn", (data:number) => {
      store.setSocketsg(data)
    })
    socket.on("nsdiss", (data:number) => {
      store.setSocketsg(data)
    })
  }, [socket])

  useEffect(() => {
    const username = localStorage.getItem("username")
    if(username) store.setUsername(username)
}, [])
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<h1>undefined</h1>}/>
          <Route path="/" element={<RootPage/>} />
          <Route path="/vote" element={<VotePage/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
