import React, { useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "./CartList.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faHeart, faPenToSquare, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthProvider';
import { getTempOrderByUser, deleteOrderItemById, closeOrder, updateOrderItemQuantity, getAllFavoriteItemsByUserId, deleteFavoriteItem} from "../../services/api";
import { isFavoriteItemExist, handleCreateFavoriteItem, isOrderItemExist } from "../utils/utilse";


function CartList(props){

   const { auth } = useContext(AuthContext);
   const [quantityRemote, setQuantityRemote] = useState(false);
   const [selectedItem, setSelectedItem] = useState('');
   const [error, setError] = useState('');

   useEffect(() => {
      async function fetchData() {
         if (auth && auth.token) {
            try{
               const params = { "Authorization": "Bearer " + auth.token };
               const tempOrder = await getTempOrderByUser(params, auth.user.userId);
               props.onLoadTempOrder(tempOrder.data.order)
               props.onLoadCartItem(tempOrder.data.orderItems);
               const favoriteItemList = await getAllFavoriteItemsByUserId(params, auth.user.userId);
               props.onLoadFavoriteItem(favoriteItemList.data);
            } catch (err) {
            }
         }
      }
      fetchData();
   }, []); 

   
   const handleAddToFavorite = async (item) => {      
      if (auth && auth.token) {
         const params = { "Authorization": "Bearer " + auth.token };
         const requestBody = { itemId: item.itemId, userId: auth.user.userId };
         if (!isFavoriteItemExist(item.itemId, props.favoriteItemList)) {
            try{
               const favoriteItem = await handleCreateFavoriteItem(requestBody, params, item);
               props.onAddToFavorite(favoriteItem);
               props.messageDisplay("Product added to favorites");
            } catch (err) {
               if (!err.response) {
                  props.errorDisplay("No server response.");
               } else if (err.response.status === 400 && err.response.data === "User does not exist" || err.response.data === "Item does not exist") {
                  props.errorDisplay(err.response.data);          
               } else {
                  props.errorDisplay("Error occurred during add item to favorits.");
               }
            }
         } else {
            try{
               const favoriteItem = isFavoriteItemExist(item.itemId, props.favoriteItemList);
               await deleteFavoriteItem(params, favoriteItem.favoriteItemId);
               props.messageDisplay("Product removed from favorites");
               props.onRemoveFromFavorite(item);
            } catch (err) {
               if (!err.response) {
                  props.errorDisplay("No server response.");
               } else if (err.response.status === 400 && err.response.data === "Item does not exist in favorites") {
                  props.errorDisplay(err.response.data);          
               } else {
                  props.errorDisplay("Error occurred during romove item from favorites.");
               }
            }
         }
      } 
   };

   const handleRemoveFromOrder = async (item) => {
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            const orderItem = isOrderItemExist(item.itemId, props.orderItemList);
            await deleteOrderItemById(params, orderItem.orderItemId);
            props.onRemoveFromOrder(item);
            props.messageDisplay("Product removed from order");
         } catch (err){
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else if (err.response.data === "Order item does not exist" ) {
               props.errorDisplay(err.response.data);          
            } else {
               props.errorDisplay("Error occurred during delete item from cart.");
            }                
         } 
      }
   };

   const handleRemoveFromOrderAfterRemote = async (item) => {
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            const orderItem = isOrderItemExist(item.itemId, props.orderItemList);
            await deleteOrderItemById(params, orderItem.orderItemId);
            props.onRemoveFromOrder(item);
            props.messageDisplay("Product removed from order");
            setQuantityRemote(!quantityRemote);
            setSelectedItem('')
         } catch (err){
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else if (err.response.data === "Order item does not exist" ) {
               props.errorDisplay(err.response.data);          
            } else {
               props.errorDisplay("Error occurred during delete item from cart.");
            }                
         } 
      }
   };

   const handleCloseQuantityRemote = () => {
      setQuantityRemote(!quantityRemote);
      setSelectedItem('');
   };
   

   const handleUpdatePlusQuantity = async (item) => {
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            const requestBody = {orderItemId: item.orderItemId  ,quantity: item.quantity+1 };
            await updateOrderItemQuantity(params, requestBody);
            props.onUpdateQuantity(item, item.quantity+1);
            if(quantityRemote){
               setQuantityRemote(false);
            }
         } catch (err){
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else if (err.response.data === "Order item does not exist" || err.response.data === "Item quantity amount is not available in stock") {
               props.errorDisplay(err.response.data);          
            } else {
               props.errorDisplay("Error occurred update item quantity");
            }         
         }
      }
   };   

   const handleUpdateMinusQuantity = async (item) => {
      if (auth && auth.token) {
         try {
            if(item.quantity >= 2){
               const params = { "Authorization": "Bearer " + auth.token };
               const requestBody = {orderItemId: item.orderItemId  ,quantity: item.quantity-1 };
               await updateOrderItemQuantity(params, requestBody);
               props.onUpdateQuantity(item, item.quantity-1);
            } else if (item.quantity === 1){
               setSelectedItem(item.itemId);
               setQuantityRemote(true);
            } else {
               const params = { "Authorization": "Bearer " + auth.token };
               await deleteOrderItemById(params, item.orderItemId);
               props.onRemoveFromOrder(item);
            }
         } catch (err){
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else if (err.response.data === "Order item does not exist" ) {
               props.errorDisplay(err.response.data);          
            } else {
               props.errorDisplay("EError occurred update item quantity");
            }         
         }
      }
   };
   
   const calculateTotalPrice = () => {
      return props.orderItemList.reduce((totalPrice, item) => 
      totalPrice + parseFloat(item.price*item.quantity), 0);
   };   

   const handleCloseTempOrder = async () => {
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            await closeOrder(params, props.tempOrder.orderId);
            props.onCloseTempOrder();  
            props.onPopupToggle("successOrder")
         } catch (err) {
            if (!err.response) {
               setError("No server response")
            } else if (err.response.status === 403) {
               setError("You must be logged in to perporm actions. Please log in or sign up.");          
            } else if (err.response.status === 400) {
               setError(err.response.data);          
            } else {
               setError("Error occurred during complete order. Please try again.");
            }
         }
      }
   };

   const handleSelectedItem = (item) => {
      return(props.onSelectItem(item))
   };


   return (
      <div className="cartPageStyle">
         <div className="cartHeaderDiv">Shopping cart</div>
         {auth && auth.token ? (
         <div className="cartDiv">
            <div className="cartListDiv">
               {props.orderItemList.length !== 0 ? (
                  props.orderItemList.map((item) => (
                     <div className="cartItemDiv" key={item.itemId}>
                        <div className="cartImageDiv">
                           <Link to="/item" onClick={()=>handleSelectedItem(item)}><img src={item.itemImage} alt="itemImage"/></Link>
                        </div>
                        <div className="cartDetailsDiv">
                           <div className="cartItemName">{item.itemName}</div>
                           <div className="cartItemPrice">
                              ${(item.price*item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                           <div className="cartItemPricePerPice">
                              ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / per piece</div>
                           <div className="updateQuantityDiv">
                              <button className="updateButton" onClick={() =>{handleUpdateMinusQuantity(item)}}><FontAwesomeIcon icon={faMinus} /></button>
                              <div className="quantity">{item.quantity}</div>
                              <button className="updateButton" onClick={() =>{handleUpdatePlusQuantity(item)}}><FontAwesomeIcon icon={faPlus} /></button> 
                           </div>
                           {item.quantity > item.stock && (<div className="quantityRemoteButton">Item is out of stock.</div>)}
                           {quantityRemote && selectedItem === item.itemId && (
                           <div className="quantityRemoteButton">
                           Do you whant to remove item from cart? 
                           <button onClick={() =>{handleRemoveFromOrderAfterRemote(item)}}>Yes</button>
                           /
                           <button onClick={handleCloseQuantityRemote}>No</button>
                           </div>)}                
                                     

                        </div>
                        <div className="buttonsDiv">
                           <button
                              className={!isFavoriteItemExist(item.itemId, props.favoriteItemList) ? "cartBtn" : "cartActiveBtn"} onClick={() => handleAddToFavorite(item)}>
                              <FontAwesomeIcon icon={faHeart} />{" "}
                           </button>
                           <button className="cartBtn" onClick={() => handleRemoveFromOrder(item)}>
                              <FontAwesomeIcon icon={faTrashCan} />
                           </button>
                        </div>
                     </div>
                  ))
               ) : (
               <div className="noItems">No items in cart</div>
               )}
            </div>
         
            {props.orderItemList.length !== 0 && (
            <div className="orderDetailsDiv">
               <div className="summaryHeader"> Summary:</div>
               <div className="summaryDiv">
                  <div className="summary">
                     <div className="summeryInerHeader">Total price:</div>
                     <div className="totalPrice">${calculateTotalPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="summaryLine"></div>
                  <div className="summary">
                     <div className="summeryInerHeader">Shipping Address:</div>
                     <div><button className="editButton" onClick={() => props.onPopupToggle("editAdrees")}><FontAwesomeIcon icon={faPenToSquare} /></button></div>
                  </div>
                     <div className="addressDiv">
                        <div className="addressBold">City: <span className="addressText">{props.tempOrder.city}</span></div>
                        <div className="addressBold">Street: <span className="addressText">{props.tempOrder.street}</span></div>
                        <div className="addressBold">Building number: <span className="addressText">{props.tempOrder.buildingNumber}</span></div>
                        <div className="addressBold">Apartment number: <span className="addressText">{props.tempOrder.apartment}</span></div>
                     </div>  
               </div>
               <button className="payButton" type="submit" onClick={handleCloseTempOrder}>Continue to pay</button>
               {error && (<div className="quantityRemoteButton">{error}</div>)}
            </div>
            )}
         </div>
         ) : (
            <div>To view your cart items, please log in.</div>
         )}
      </div>
   );
    
}



export default CartList;