import React, {useState} from 'react';
import Matches from "./Matches";
import Chat from "./Chat";
import Home from "./Home";
import Profile from "./Profile";
import DesktopAppbar from "./DesktopAppbar";


const Desktop = (props) => {
    const [profileMode, setProfileMode] = useState(false);
    // profileMode state is used to toggle between showing the Profile component and other components
    // Destructuring props to extract setChatMode, chatMode, matches, and setMatches for use within the component
    const {setChatMode, chatMode, matches, setMatches} = props;
    //SetChatMode: State setter that will open the chat window
    //Chatmode: state that contains the chat users info and the chatID of that person
    //matches: Contains the users current matches.
    //SetMathces: Sets the previous state
    return (
        <div>
            <DesktopAppbar setProfileMode={setProfileMode} profileMode={profileMode}/>
            <div className="content-container">
                {profileMode ? <Profile/> : <Matches setChatMode={setChatMode} setMatches={setMatches}/>}
                {chatMode ? <Chat chatInfo={chatMode} setChatMode={setChatMode}/> : <Home setChatMode={setChatMode} matches={matches}/>}
            </div>
        </div>
    );
};

export default Desktop;