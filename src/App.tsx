import RootPage from "./page/RootPage/RootPage";
import "./styles/index.sass"
import {
  BrowserRouter,
  Routes, 
  Route,
  Navigate
} from "react-router-dom";
import { socket, updateInstance,server, connect } from "./websocket/socket";
import { useContext, useEffect } from "react";
import VotePage from "./page/VotePage/VotePage";
import AdminPage from "./page/AdminPage/AdminPage";
import { ctx } from ".";
import NotFoundPage from "./page/NotFoundPage/NotFoundPage";
import FlowPage from "./page/FlowPage/FlowPage";
import LogModal from "./component/LogModal/LogModal";
import VerifyPage from "./page/VerifyPage/VerifyPage";
import AuthPage from "./page/AuthPage/AuthPage";
import { observer } from "mobx-react-lite";
import ProfilePage from "./page/ProfilePage/ProfilePage";
import ChatPage from "./page/ChatPage/ChatPage";
import LoadingContainer from "./component/LoadingContainer/LoadingContainer";
import ContestPage from "./page/ContestPage/ContestPage";
 
function App() {
  const {store} = useContext(ctx)
  useEffect(() => {
    if(localStorage.getItem("voted")) {
      store.setVoted(true)
    }
  },[])
  
  useEffect(() => {
    store.checkAuth()
    if(localStorage.getItem('regsession') && localStorage.getItem('regsession_payload')) store.regsessionStatus = true
}, [])

  useEffect(() => {
      const username = localStorage.getItem("username")
      if(username) store.setUsername(username)
  }, [])

  useEffect(() => {
    store.addSocketDebugLog({
        action: "AUTH",
        error: false,
        message: `requesting connection with ${server} using local BEARER token`,
        timestamp: Date.now().toString()
    })
    connect()
}, [])

  if(store.loading) return <LoadingContainer/>
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFoundPage/>}/>
          <Route path="/" element={<RootPage/>} />
          <Route path="/flow" element={<FlowPage/>}/>
          <Route path="/vote" element={<VotePage/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
          <Route path="/chat" element={<ChatPage/>}/>
          <Route path="/contest" element={<ContestPage/>}/>
          <Route path="/pf/:id" element={<ProfilePage edit={false} preview={true}/>}/>
          <Route path="/pf" element={
            store.isAuth
              ?
              <ProfilePage preview={false} edit={false}/>
              :
                store.regsessionStatus
                  ?
                  <VerifyPage/>
                  :
                  <>
                    <AuthPage login={false}/>
                  </>
                  
                  
          }/>
          {
            store.isAuth
              &&
              <Route path="/pf/edit" element={<ProfilePage preview={false} edit={true}/>}/>
          }
          <Route path="/pf/login" element={<AuthPage login={true}/>}/>
          
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default observer(App);
