import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


function MessagePopup(props){


   return (
         <div className={props.isMessageOpen ? "popupMessage" : "popupmError"}>
            <button className="closeButton" onClick={() => props.onMessageCloes()}> <FontAwesomeIcon icon={faXmark }/></button>
            {props.isMessageOpen && <div>{props.message}</div>}
            {props.isErrorOpen && <div>{props.error}</div>}

      </div>
   );

}

export default MessagePopup;