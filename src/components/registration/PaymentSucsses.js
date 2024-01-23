import React from "react";
import './Popup.css';
import { Link } from "react-router-dom";

function PaymentSucsses(props){


   return(
      <div className="popupStyle">
         <div className="popupHeader">You order has compleeted succesfuly</div>
         <div className="popupSecondHeaderToHome">Want to continue shopping? <div className="popupLinkToHomeButton"><Link to="/"  onClick={() => props.onPopupCloes('')}> Go to home page</Link></div></div>
      </div>
   );
}


export default PaymentSucsses;