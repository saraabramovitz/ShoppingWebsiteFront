import React, {useContext, useRef, useState, useEffect} from "react";
import {updateShippingAddress } from '../../services/api'
import AuthContext from '../context/AuthProvider';
import './Popup.css'

function EditAddress(props){

   const { auth } = useContext(AuthContext);
   const userRef = useRef();

   const [error, setError] = useState('');
   const [city, setCity] = useState('');
   const [street, setStreet] = useState('');
   const [buildingNumber, setBuildingNumber] = useState('');
   const [apartment, setApartment] = useState('');

   useEffect(() => {
      userRef.current.focus();
   }, []);

   const handleUpdateShippingAddress = async (event) => {
      event.preventDefault();
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            const address = { city: city, street: street, buildingNumber: buildingNumber, apartment: apartment };
            const requestBody = { orderId: props.tempOrder.orderId, address: address };
            const shippingAddress = { orderId: props.tempOrder.orderId, city: city, street: street, buildingNumber: buildingNumber, apartment: apartment };
            await updateShippingAddress(params, requestBody);
            props.onChangeShippingAddress(shippingAddress);     
            props.onPopupCloes('') ; 
         } catch (err) {
            handleError(err);
         }
      }
   };
   
   const handleError = (err) => {
      if (!err.response) {
         setError("No server response.");
      } else if (err.response.status === 403) {
         setError("You must be logged in to update your address. Please log in or sign up.");          
      } else {
         setError("Error occurred during update address. Please try again.");
      }
  };

   return(
      <div className="popupStyle">
         <div className="popupHeader">Edit shipping adress</div>
         <div className="popupSecondHeader">Change your order shipping address</div>
            <form onSubmit = {handleUpdateShippingAddress}>
               <input
                  className="popupInputFullLine"
                  type="text"
                  autoComplete="off"
                  ref={userRef}
                  onChange={(event) => {
                     setError('');
                     setCity(event.target.value);
                  }}
                  placeholder="City"
                  value={city}
                  required
               ></input>
               <input
                  className="popupInputFullLine"
                  type="text"
                  autoComplete="off"
                  onChange={(event) => {
                     setError('');
                     setStreet(event.target.value);
                  }}
                  placeholder="Street"
                  value={street}
                  required
               ></input>
               <div className="inputRow">
                  <input
                     className="popupInput"
                     type="number"
                     inputmode="numeric"
                     pattern="[0-9]*"
                     onChange={(event) => {
                        setError('');
                        setBuildingNumber(event.target.value);
                     }}
                     placeholder="Building number"
                     value={buildingNumber}
                     required
                  ></input>
                  <input
                     className="popupInput"
                     type="number"
                     inputmode="numeric"
                     onChange={(event) => {
                        setError('');
                        setApartment(event.target.value);
                     }}
                     placeholder="Apartment number"
                     value={apartment}
                  ></input>
               </div>
               <button type="submit" className="popupButton">Change address</button>
         </form>
         {error && <div className="errorMessage">{error}</div>}
      </div>
      
   );
}

export default EditAddress;
