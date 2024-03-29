import React from "react";
import SignUp from './SignUp';
import Login from './Login';
import LoginRemote from './LoginRemote'
import PaymentSucsses from './PaymentSucsses'
import RegisterSelect from './RegisterSelect'
import './Popup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import EditAddress from './EditAddress'


function RegistrationPopup(props) {

            
   const handleSetMessage  = (message) => {
      props.messageDisplay(message);
   };

   const handleSetError  = (error) => {
      props.errorDisplay(error)
   };

   const handleSetFavoriteItemList = (favoriteItemList) => {
      props.onLoadFavoriteItem(favoriteItemList);
   };

   const handleSetCartItemList = (orderItemList) => {
      console.log("orderItemList from RegistrationPopup" , orderItemList)
      props.onLoadCartItem(orderItemList);
   };
   
   const handleSetTempOrder = (tempOrder) => {
      props.onLoadTempOrder(tempOrder);
   };

   const handleLogout = () =>{
      props.onLogout();
   };

   const handlePopupClose = () =>{
      props.onPopupCloes();
   };

   const handleSetOrderList = (userOrderList) => {
      props.onLoadOrderList(userOrderList);
   };


   return (
      <div className="popupBackground">
         <div className="popup">
            <button className="closeButton" onClick={() => props.onPopupCloes('')}> <FontAwesomeIcon icon={faXmark }/></button>
            {props.popupType === 'registerSelect' &&
               <div>
                  <RegisterSelect 
                  messageDisplay={handleSetMessage}
                  errorDisplay={handleSetError}                     
                  onLoadOrderList={handleSetOrderList}
                  onPopupCloes={handlePopupClose} 
                  onLogout={handleLogout}
                  onPopupToggle={props.onPopupToggle}/>
                  
               </div>
            }
            {props.popupType === 'signup' &&
               <div>
                  <SignUp 
                     onPopupToggle={props.onPopupToggle}
                  />
               </div>
            }
            {props.popupType === 'editAdrees' &&
               <div>
                  <EditAddress
                     tempOrder ={props.tempOrder}
                     onPopupToggle={props.onPopupToggle}
                     onChangeShippingAddress={props.onChangeShippingAddress} 
                     onPopupCloes={handlePopupClose} 
                     />
               </div>
            }
            {props.popupType === 'successOrder' &&
               <div>
                  <PaymentSucsses 
                  onPopupCloes={handlePopupClose} 
                  onPopupToggle={props.onPopupToggle}/>
               </div>
            }
            {props.popupType === 'loginRemote' &&
               <div>
                  <LoginRemote 
                  onPopupCloes={handlePopupClose} 
                  onPopupToggle={props.onPopupToggle}/>
               </div>
            }
            {props.popupType === 'login' && 
               (<div>
                  <Login
                  onPopupToggle={props.onPopupToggle}
                  onLoggedIn={props.onPopupCloes}
                  onLoadFavoriteItem={handleSetFavoriteItemList}
                  onLoadCartItem={handleSetCartItemList}
                  onLoadOrderList={handleSetOrderList}
                  onPopupCloes={handlePopupClose} 
                  onLoadTempOrder = {handleSetTempOrder}
                  />
               </div>)
            }
         </div>
      </div>
   );

}


export default RegistrationPopup;