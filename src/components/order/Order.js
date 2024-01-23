import React, { useContext, useState, useEffect } from "react";
import './Order.css';
import AuthContext from '../context/AuthProvider';
import { getOrderItemsByOrderId, deleteOrderById, getOrdersByUserId } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function Order(props) {

  const { auth } = useContext(AuthContext);
  const [orderItemsList, setOrderItemsList] = useState([]);

  useEffect(() => {
      async function fetchData() {
         if (auth && auth.token) {
            try {
               props.errorDisplay('');
               props.messageDisplay('');
               const params = { "Authorization": "Bearer " + auth.token };
               const userOrderList = await getOrdersByUserId(params,  auth.user.userId);
               props.onLoadOrderList(userOrderList.data);
            } catch(err){
            }
         }
      }
      fetchData();
   }, []); 

   
  const isOrderItemListExist = (orderId) => {
      return orderItemsList.some((itemList) => itemList.orderId === orderId);
   };

   const handleGetOrderItems = async (orderId) => {
      if (isOrderItemListExist(orderId)) {
         setOrderItemsList((prevItemList) => prevItemList.filter(itemList => itemList.orderId !== orderId));
      } else {
         if (auth && auth.token) {
            try {
               const params = { "Authorization": "Bearer " + auth.token };
               const userOrderItemsList = await getOrderItemsByOrderId(params, orderId);
               const orderItemForDisplay = {
                  orderId: orderId,
                  orderItems: userOrderItemsList.data
               }
               setOrderItemsList((prevItemList) => [...prevItemList, orderItemForDisplay]);
            } catch(err){
               props.errorDisplay("Error occurred during getting order items.");                  
            }
         } 
      }
   };

   const handleDisplayOrderItems = (orderId) => {
      const selectedOrderItems = orderItemsList.find(itemList => itemList.orderId === orderId);
      if (selectedOrderItems && selectedOrderItems.orderItems.length > 0) {
         return selectedOrderItems.orderItems;
      } else {
         return null;
      }
   };

   const handleDeleteOrder = async (order) => {
      if (auth && auth.token) {
         try {
            const params = { "Authorization": "Bearer " + auth.token };
            await deleteOrderById(params, order.orderId);
            props.onDeleteOrder(order.orderId);
         } catch (err) {
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else if (err.response.data === "Order does not exist") {
               props.errorDisplay(err.response.data);          
            } else {
               props.errorDisplay("Error occurred during delete order.");
            }
      }
      } 
   };
  
   const calculateTotalPrice = (order) => {
      const orderItems = handleDisplayOrderItems(order.orderId)
      return orderItems.reduce((totalPrice, item) => totalPrice + parseFloat(item.price*item.quantity), 0);
   };


   return (
      <div className="orderPageStyle">
         <div className="orderHeaderDiv">My orders</div>
         {props.userOrderList.length !== 0 ? props.userOrderList.map((order) => (
            <div className="orderListDiv" key={order.orderId}>
               <div className={order.orderStatus === "TEMP" ? "tempDiv" : "orderDiv"}>
                  <div className="orderDetails">
                     <div className="details">
                        <div className="bold">Creation date:</div>
                        <div className="detailsText">{order.orderDate} </div>
                     </div>
                     <div className="details">
                        <div className="bold">Order status:</div>
                        <div className="detailsText orderStatus">{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1).toLowerCase()}</div>
                     </div>
                     <div className="details">
                        <div className="bold">Shipping address:</div>
                        <div className="detailsText">City: {order.city}<span className="separator"> | </span>Street: {order.street}<span className="separator"> | </span>Building number: {order.buildingNumber}<span className="separator"> | </span>Apartment number: {order.apartment}</div>
                     </div>
                  </div>
                  <div className="orderButtons">
                     <button className={isOrderItemListExist(order.orderId) ? "hideItemsButton" : "showItemsButton"} onClick={() => handleGetOrderItems(order.orderId)}>
                        {isOrderItemListExist(order.orderId) ? 'Hide Order Items' : 'Show Order Items'}
                     </button>
                     <button className="trashBtn" onClick={() => handleDeleteOrder(order)}><FontAwesomeIcon icon={faTrashCan} /></button>
                  </div>
               </div>
               {orderItemsList.length > 0 && isOrderItemListExist(order.orderId) && handleDisplayOrderItems(order.orderId) && (
                  <div className="orderDisplayDiv">
                     <div className="orderItemsDiv">
                        {handleDisplayOrderItems(order.orderId).map((item) => (
                           <div className="orderItem" key={item.itemId}>
                              <div className="orderItemImageDiv"><img src={item.itemImage} alt="itemImage" /></div>
                              <div className="orderItemdetailsDiv">
                                 <div className="ItemInOrderHeader">{item.itemName}</div>
                                 <div className="orderText"><span className="boldOrderText">Price: </span>${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                 <div className="orderText"><span className="boldOrderText">Quantity: </span>{item.quantity}</div>
                              </div>
                           </div>                
                        ))}
                     </div>
                     <div className="totalDiv">Order total price: ${calculateTotalPrice(order).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
               )}
            </div>
         )) : <div>No orders exist</div>}
      </div>
   );
}

export default Order;
