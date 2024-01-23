import React from "react";
import './Popup.css'


function RegisterSuccess(props){

   return(
      <div className="popupStyle">
         <div className="popupHeader">Your order has been processed successfully</div>
         <button className="popupButton" onClick={() => props.onPopupToggle('login')}>login</button>
      </div>
   );

}

export default RegisterSuccess;