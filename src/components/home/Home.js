import React, { useContext , useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import AuthContext from '../context/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { getAllFavoriteItemsByUserId, getTempOrderByUser, deleteOrderItemById, deleteFavoriteItem } from "../../services/api";
import { isFavoriteItemExist, handleCreateFavoriteItem, isOrderItemExist, isOrderExist, handleCreateOrderItem, handleCreateNewOrder } from "../utils/utilse";
import './Home.css'


function Home(props) {

   const targetDivRef = useRef(null);
   const { auth } = useContext(AuthContext);

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
               if(item.stock > 0){
               const orderItem = await handleCreateOrderItem (requestBody, params, item);
               props.onAddToOrder(orderItem);
                  if(!isOrderExist(orderItem.orderId, props.userOrderList)){
                  const orderToCreate = handleCreateNewOrder(orderItem.orderId, auth);   
                  props.onAddNewOrder(orderToCreate);
                  }
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

   const handleSelectedItem = (item) => {
      return props.onSelectItem(item);
   };

   const handleTargetClick = () => {
      targetDivRef.current.scrollIntoView({ behavior: 'smooth' });
   };
  

   return (
      <div className="homePageStyle">
         {!props.showSearchItem && (
            <div className="headerDiv">
               <div className="headerImageDiv"><img src="https://i.imgur.com/pw3yIAF.jpg" alt="header" /></div>
               <div className="headerTextDiv">
                  <div className="headerText">ULTIMATE COMFORT FOR YOUR HOME
                     <button className="headerButton" onClick={handleTargetClick}>Start Shopping</button>
                  </div>
               </div>
            </div>
         )}
         
         {props.showSearchItem && (<div className="homeHeader">Search items results</div>)}
         {props.itemListForDisplay.length !== 0 ? (               
         <div className="itemListDiv" ref={targetDivRef}>
            {props.itemListForDisplay.map((item) => (
               <div className="itemDiv" key={item.itemId}>
                  <div className="itemImageDiv">
                     <Link to="/item" onClick={() => handleSelectedItem (item)}><img src={item.itemImage} alt="itemImage"/></Link>
                  </div>
                  <div className="itemDetailsDiv">
                     <div className="nameAndPriceDiv">
                        <div className="itemName">{item.itemName}</div>
                        <div className="itemPrice">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                     </div>
                  </div>
                  {item.stock < 1 && (<div className="outOfStock">Item is out of stock.</div>)}

                  <div className="actionButtons">
                     <button 
                        onClick={auth.isLoggedin ? (() => handleAddToCart(item)) : (() => props.onPopupToggle("loginRemote"))}
                        className={!isOrderItemExist(item.itemId, props.orderItemList) ? (item.stock > 0 ? "cartButton" : "disable") : "activeCartButton"}  >                      {!isOrderItemExist(item.itemId, props.orderItemList) ? " add to cart": " remove from cart"}
                     </button>
                     <button 
                        onClick={auth.isLoggedin ? (() => handleAddToFavorite(item)) : (() => props.onPopupToggle("loginRemote"))}
                        className={!isFavoriteItemExist(item.itemId ,props.favoriteItemList) ? "favoriteButton" : "activeFavoriteButton"}>
                        <FontAwesomeIcon icon={faHeart} /> 
                     </button>
                  </div>
               </div>
            ))}

         </div>
         ) : (
         <div className="noItems">No items have matched for your search.</div>
         )}
      </div>
   );
    
}    


export default Home;