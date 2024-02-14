import './App.css';
import LoginAndRegister from './Components/LoginAndRegister.jsx'
import Home from "./Components/Home"
import Matches from "./Components/Matches";
import Chat from "./Components/Chat";
import { useState, useEffect} from "react";
import Mobile from "./Components/Mobile";



function App() {
  const  [logStatus, setLogStatus] = useState(false);
  const [chatMode, setChatMode] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  function handleWindowSizeChange() {
        setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }}, []);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/private', {
        headers: {'Authorization': 'Bearer ' + token}
      })
          .then(response => {
            if (response.ok) {
              setLogStatus(true);
            } else {
              setLogStatus(false);
            }
          })
          .catch(e => {throw e});

    }
  }, []);

    return (
        <div className="App">
            {logStatus ? (
                isMobile ? <Mobile setChatMode={setChatMode} chatMode={chatMode}/> :
                <div className="content-container">
                    <Matches setChatMode={setChatMode} />
                    {chatMode ? <Chat chatInfo={chatMode} setChatMode = {setChatMode}/>:<Home/> }
                </div>
            ) : (
                <LoginAndRegister />
            )}
        </div>
    );
}

export default App;
