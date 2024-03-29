import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthProvider';
import { deleteFavoriteItem, getAllFavoriteItemsByUserId, getTempOrderByUser, deleteOrderItemById} from "../../services/api";
import { isOrderItemExist, isOrderExist, handleCreateOrderItem, handleCreateNewOrder } from "../utils/utilse";
import "./FavoriteList.css"


function FavoriteList(props) {

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
            } catch(err){
            }
         }
      }
      fetchData();
   }, []); 


   const handleRemoveFromFavorite = async (item) => {
      if (auth && auth.token) {
         const params = { "Authorization": "Bearer " + auth.token };
         try {
            await deleteFavoriteItem(params, item.favoriteItemId);
            props.onRemoveFromFavorite(item);
            props.messageDisplay("Product removed from favorites")
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
                  props.errorDisplay("Error occurred during delete item from cart.");
               }                
            } 
         } 
      };
   }

   const handleSelectedItem = (item) => {
      return( props.onSelectItem(item))
   };


   return (
      <div className="favPageStyle">
            <div className="favHeaderDiv">Favorite products</div>
            {auth && auth.token ? (
            <div className="favDiv">
            <div className="favItemListDiv">
            {props.favoriteItemList.length !== 0 ? props.favoriteItemList.map((item) => (
               <div className="favItemDiv" key={item.itemId}>
                  <div className="favImageDiv">
                     <Link to="/item" onClick={()=>handleSelectedItem(item)}><img src={item.itemImage} alt="itemImage"/></Link>
                  </div>
                  <div className="favDetailsDiv">
                     <div className="favDetailsText">
                        <div className="favItemName">{item.itemName}</div>
                        <div className="favItemOverview">{item.itemOverview}</div>
                        <div className="favItemPrice">Price: ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        {item.stock === 0 && (<div className="quantityRemoteButton">Item is out of stock.</div>)} 

                     </div>
                  </div>
                  <div className="buttonsDiv">
                     <button className={!isOrderItemExist(item.itemId, props.orderItemList) ? "favBtn" : "active"} onClick={() => handleAddToCart(item)}>
                        <FontAwesomeIcon icon={faCartShopping} />
                     </button>
                     <button className="favBtn" onClick={() => handleRemoveFromFavorite(item)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                     </button>
                  </div>
               </div>
               )) : <div className="noItems">No items in favorite list</div>}
            </div>
            </div>
         ) : (
            <div>Sign in to view your favorite items.</div>
         )}
      </div>
   );
   
}


export default FavoriteList;
