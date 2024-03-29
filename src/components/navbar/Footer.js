import React, { useContext } from "react";
import { Link } from "react-router-dom";
import './Footer.css';
import AuthContext from '../context/AuthProvider';
import {getOrdersByUserId} from '../../services/api'


function Footer(props) {

   const { auth } = useContext(AuthContext);

   const handleGetUserOrders = async () => {
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            const userOrderList = await getOrdersByUserId(params, auth.user.userId);
            props.onLoadOrderList(userOrderList.data);
            props.onPopupCloes('');
         } catch (err) {
            if (!err.response) {
            } else if (err.response.status === 403) {
               props.errorDisplay("You must be logged in order to perform actions. Please log in or sign up.");          
            } else {
               props.errorDisplay("Error occurred during getting user orders.");
            }      
         }
      } else {
         props.onPopupToggle("loginRemote");
      }
   };     

   const handleCheckIfLogin = () => {
      if (!auth.isLoggedin) {
         props.onPopupToggle("loginRemote");
      }
   };
   

   return (
      <div>
         <div className="footerPage">
            <footer className="footer">
               <div className="logoFooterDiv">
                  <div className="footerDiv">
                     <div className="footerLogo"><Link to="/"><img src="https://i.imgur.com/D0FJ2Tx.png" alt="Logo" /></Link></div>
                     <div className="footerInerHeader">Sales and Customer Service</div>
                     <div className="footerText"><span className="footerBold">Phone: </span>1-700-80-80-50</div>
                     <div className="footerText"><span className="footerBold">Email: </span>info@homey.co.il</div>
                     <div className="footerText"><span className="footerBold">Mail and Letters:</span> 110 Hashkamot Street, Rishon LeZion</div>
                  </div>
               </div>
               <div className="footerRightDiv">
               <div className="footerDiv">
                  <div className="footerLogo"></div>
                  <div className="footerInerHeader">Site Navigation</div>
                  <div className="footerTextRight"><Link to="/favoriteItems" onClick={handleCheckIfLogin}>Go to my favorites</Link></div>
                  <div className="footerTextRight"><Link to="/cart" onClick={handleCheckIfLogin}>Go to my cart</Link></div>
                  <div className="footerTextRight"><Link to="/orders" onClick={handleGetUserOrders}>Go to my orders</Link></div>
               </div>
               </div>
            </footer>
         </div>
         <div className="allRights">© Designed & built by S. Avramovitz sh0527685990@gmail.com - 2024 </div>
      </div>  

   );


}



export default Footer;