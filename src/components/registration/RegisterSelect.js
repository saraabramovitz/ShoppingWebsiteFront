import React, { useContext } from "react";
import AuthContext from '../context/AuthProvider';
import {Link } from "react-router-dom";
import './Popup.css'
import {getOrdersByUserId, deleteUser} from '../../services/api'


function RegisterSelect(props){

   const { setAuth, auth } = useContext(AuthContext);   

   const handleLogout = () => {
      setAuth({ user: null, token: null, isLoggedin: false });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      props.onPopupCloes('')
      props.onLogout();
   };

   const handleDeleteUser = async () => {
      if (auth && auth.token) {
         const params = { "Authorization": "Bearer " + auth.token };
         try{
            await deleteUser(params, auth.user.userId);
            setAuth({ user: null, token: null, isLoggedin: false });
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            props.onLogout();
            props.messageDisplay("Account has been deleted successfully.");
            props.onPopupCloes('');
         } catch (err) {
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else if (err.response.status === "User does not exist") {
               props.errorDisplay("User does not exist");   
            } else {
               props.errorDisplay("Error occurred during delete user.");
            }
         }
      }
   };
    
   const handleGetUserOrders = async () => {
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            const userOrderList = await getOrdersByUserId(params, auth.user.userId);
            console.log(userOrderList)
            props.onLoadOrderList(userOrderList.data);
            props.onPopupCloes('');
         } catch (err) {
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else{
               props.errorDisplay("Error occurred during getting user data.");
            }                   
         }
      } 
   };


   return(
      <div className="popupStyle">
         {auth.isLoggedin ? (
            <div className="popupHeader">Hy {auth.user.firstName + " " + auth.user.lastName}</div>
         ): <div className="popupHeader">Log in / Register</div>}
         {auth.isLoggedin ? (
            <div>
               <div className="space"></div>
               <div className="userSelect"><Link to="/orders" onClick={handleGetUserOrders}>My orders</Link></div>
               <div className="line"></div>
               <div className="userSelect"><Link to="/cart" onClick={() => props.onPopupCloes('')}>My cart</Link></div>
               <div className="line"></div>
               <div className="userSelect"><Link to="/favoriteItems" onClick={() => props.onPopupCloes('')}>My favorites</Link></div>
               <div className="space"></div>
               <button className="popupBlackButton" onClick={handleLogout}>Log out</button>
               <button className="menueDeleteButton" onClick={handleDeleteUser}>Delete my acount</button>

            </div>
         ) : (
            <div>
               <div className="littleSpace"></div>
               <div className="popupSecondHeader">Already have an account?</div>
               <button className="popupBlackButton" onClick={() => props.onPopupToggle("login")}>Log in</button>
               <div className="littleSpace"></div>
               <div className="popupSecondHeader">To create a new acount</div>
               <button className="popupBlackButton" onClick={() => props.onPopupToggle("signup")}>Sign up</button>
            </div>
         )}
      </div>
   );

}

export default RegisterSelect;