import './App.css';
import LoginAndRegister from './Components/LoginAndRegister.jsx'
import Home from "./Components/Home"
import Matches from "./Components/Matches";
import Chat from "./Components/Chat";
import { useState, useEffect} from "react";
import Mobile from "./Components/Mobile";
import Desktop from "./Components/Desktop";



function App() {
  const  [logStatus, setLogStatus] = useState(false);
  const [chatMode, setChatMode] = useState(null);
  const [matches, setMatches] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;


  //Provides all the users matches and set's them in the matches state
  function getMatches() {
        try {
            const token = localStorage.getItem('token');
            fetch("/api/matches/all",
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        setMatches(data.matches);
                        }
                    )
                }
            });
        } catch (e) {
            console.error("Error in fetching match", e);
        }
  }

  //Update matches state to exclude all matches from being presented
    useEffect(() => {
        if (logStatus) {
            getMatches()
        }
    }, [logStatus]);

  //The useEffect handles the image resizing and updated the width state ...
  //...that updates the isMobile variable.
  function handleWindowSizeChange() {
        setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }}, []);


//This use effect checks the user login status by sending a request to ...
// ...an API endpoint that checks the token validity
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/private', {
        headers: {'Authorization': 'Bearer ' + token}
      })
          .then(response => {
              //Based if the response is okay the log status gets updated
            if (response.ok) {
              setLogStatus(true);
            } else {
              setLogStatus(false);
            }
          })
          .catch(e => {throw e});

    }
  }, []);
    //Based on the isMobile the desktop or mobile environment is rendered.
    //The lodStatus renders the login page if the there is no token or is a non valid token.
    //The chatmode decides if the chatWindow is rendered. ChatMode keeps the users information.
    return (
        <div className="App">
            {logStatus ? (
                isMobile ?
                    <Mobile setChatMode={setChatMode} chatMode={chatMode}
                    matches={matches} setMatches={setMatches}
                    />
                :
                    <Desktop setChatMode={setChatMode} chatMode={chatMode}
                             matches={matches} setMatches={setMatches}
                    />
            ) : (
                <LoginAndRegister />
            )}
        </div>
    );
}

export default App;
