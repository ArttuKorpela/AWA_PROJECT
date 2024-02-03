import logo from './logo.svg';
import './App.css';
import LoginAndRegister from './Components/LoginAndRegister.jsx'
import Home from "./Components/Home"
import { useState, useEffect} from "react";



function App() {
  const  [logStatus, setLogStatus] = useState(false);


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
        {logStatus ? <Home/> : <LoginAndRegister/>}
    </div>
  );
}

export default App;
