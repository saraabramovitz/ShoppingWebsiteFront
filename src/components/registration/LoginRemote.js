import React from "react";
import './Popup.css'


function LoginRemote(props){

   return(
      <div className="popupStyle">
         <div className="popupRemote">
            <div  className="remoteText">You must log in to perform actions.</div>
            <button className="popupRemoteButton" onClick={() => props.onPopupToggle('login')}>log in</button>        
         </div>
      </div>
   );

}

export default LoginRemote;