import React, { useContext, useRef, useEffect, useState } from "react";
import './Item.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthProvider';
import { getTempOrderByUser, getAllFavoriteItemsByUserId, deleteOrderItemById, deleteFavoriteItem } from "../../services/api";
import { isFavoriteItemExist, isOrderItemExist, isOrderExist, handleCreateOrderItem, 
   handleCreateFavoriteItem, handleCreateNewOrder} from '../utils/utilse';


function Item(props) {

   const { auth } = useContext(AuthContext);
   const selectedItemRef = useRef(props.item);

   useEffect(() => {
      const savedItem = localStorage.getItem('selectedItem');
      if (savedItem) {
         selectedItemRef.current = JSON.parse(savedItem);
      } else {
         selectedItemRef.current = props.item;
      }
      return () => {
         localStorage.setItem('selectedItem', JSON.stringify(selectedItemRef.current));
      };
   }, []);
   
   useEffect(() => {
      async function fetchData() {
         if (auth && auth.token) {
            try {
               const params = { "Authorization": "Bearer " + auth.token };
               const tempOrder = await getTempOrderByUser(params, auth.user.userId);
               if(tempOrder.data !== null){
                  props.onLoadTempOrder(tempOrder.data.order)
                  props.onLoadCartItem(tempOrder.data.orderItems);
               }
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
               props.messageDisplay("Product added to favorite")
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
               props.onRemoveFromFavorite(item);
               props.messageDisplay("Product removed from favorite")
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
      
   const handleAddToCart = async(item) => {      
      if (auth && auth.token) {
         const params = { "Authorization": "Bearer " + auth.token };
         const requestBody = { itemId: item.itemId, userId: auth.user.userId };
         if (!isOrderItemExist(item.itemId, props.orderItemList)) {
            try{
               const orderItem = await handleCreateOrderItem (requestBody, params, item);
               props.onAddToOrder(orderItem);
               if(!isOrderExist(orderItem.orderId, props.userOrderList)){
                  const orderToCreate = handleCreateNewOrder(orderItem.orderId, auth);   
                  props.onAddNewOrder(orderToCreate);
                  props.messageDisplay("Product added to cart")
               }   
            } catch (err){
               if (!err.response) {
                  props.errorDisplay("No server response.");
               } else if (err.response.data === "User does not exist" || err.response.data === "Item does not exist"
               || err.response.data === "Item is not available in stock" || err.response.data === "Item already exist in order") {
                  props.errorDisplay(err.response.data);          
               } else {
                  props.errorDisplay("Error occurred during add item to cart.");
               }         
            }
         } else {
            try{
               const orderItem = isOrderItemExist(item.itemId, props.orderItemList);
               await deleteOrderItemById( params, orderItem.orderItemId);
               props.onRemoveFromOrder(item);
               props.messageDisplay("Product removed from cart")
            } catch (err){
               if (!err.response) {
                  props.errorDisplay("No server response.");
               } else if (err.response.data === "Order item does not exist" ) {
                  props.errorDisplay(err.response.data);          
               } else {
                  props.errorDisplay("Error occurred during delete item from cart");
               }                
            } 
         } 
      };
   }

    
   return (
     <div className="itemPageStyle">
         <div className="itemHeaderDiv">{selectedItemRef.current.itemName}</div>
         <div className="itemInfoDiv">
            <div className="itemInfoImageDiv"><img src={selectedItemRef.current.itemImage} alt="itemImage" /></div>
            <div className="itemInfoDetailsDiv">
               <div className="infoDiv">
                  <div className="itemOverview">{selectedItemRef.current.itemOverview}</div>
               </div>
               <div className="infoDiv">
                  <div className="inerHeader">More about:</div>
                  <div className="infoText">{selectedItemRef.current.itemDetails}</div>
               </div>
               <div className="infoDiv">
                  <div className="inerHeader">Sizes:</div>
                  <div className="infoText">{selectedItemRef.current.itemMeasurements}</div>
               </div>
               <div className="infoDiv">
                  <div className="inerHeader">Price:</div>
                  <div className="infoText">${selectedItemRef.current.price && selectedItemRef.current.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
               </div>
               {selectedItemRef.current.stock === 0 && (<div className="quantityRemoteButton">Item is out of stock.</div>)} 
            </div>
            
            <div className="itemInfoButtonsDiv">
               <button 
                  onClick={auth.isLoggedin ? (() => handleAddToCart(selectedItemRef.current)) : (() => props.onPopupToggle("loginRemote"))}
                  className={!isOrderItemExist(selectedItemRef.current.itemId, props.orderItemList) ? "defaultBtn" : "activeBtn"}>
                  {!isOrderItemExist(selectedItemRef.current.itemId, props.orderItemList) ? " add to cart ": " remove from cart "}
               </button>
               <button
                  onClick={auth.isLoggedin ? (() => handleAddToFavorite(selectedItemRef.current)) : (() => props.onPopupToggle("loginRemote"))}
                  className={!isFavoriteItemExist(selectedItemRef.current.itemId ,props.favoriteItemList) ? "itemfavBtn" : "itemfavActiveBtn"}>
                  <FontAwesomeIcon icon={faHeart} /> 
               </button>
               
            </div>
         </div>
     </div>
    );

}



export default Item;
