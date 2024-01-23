import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/navbar/NavigationBar";
import Home from "./components/home/Home";
import Footer from "./components/navbar/Footer";
import FavoriteList from "./components/item/FavoriteList";
import CartList from "./components/item/CartList";
import Order from "./components/order/Order";
import RegistrationPopup from "./components/registration/RegistrationPopup";
import { getAllItems } from "./services/api";
import { AuthProvider } from "./components/context/AuthProvider";
import Item from "./components/item/Item";
import MessagePopup from './components/registration/MessagePopup'

function App() {


   const [popupType, setPopupType] = useState('');
   const [isPopupOpen, setPopupOpen] = useState(false);
   const [itemListBySearch, setItemListBySearch] = useState([]);
   const [favoriteItemList, setFavoriteItemList] = useState([]);
   const [tempOrder, setTempOrder] = useState();
   const [orderItemList, setOrderItemList] = useState([]);
   const [allItems, setAllItems] = useState([]);  
   const [showSearchItem, setShowSearchItem] = useState(false);
   const [userOrderList, setUserOrderList] = useState([]);
   const [selectedItem, setSelectedItem] = useState('');
   const [message, setMessage] = useState('');
   const [isMessageOpen, setMessageOpen] = useState(false);
   const [error, setError] = useState('');
   const [isErrorOpen, setErrorOpen] = useState(false);

   
   useEffect(() => {
      getAllItems().then(response => {
         setAllItems(response.data);
      })
   }, []); 

   const handleSetMessage  = (message) => {
      setMessage('');
      setMessage(message);
      setErrorOpen(false);
      setMessageOpen(true);
      setTimeout(() => {
         setMessage(''); 
         setMessageOpen(false);
      }, 5000);
   };

   const handleSetError  = (error) => {
      setError('');
      setError(error);
      setMessageOpen(false);
      setErrorOpen(true);
      setTimeout(() => {
         setError(''); 
         setErrorOpen(false);
      }, 5000);
   };

   const handleMessageClose = () => {
      setMessage('');
      setMessageOpen(false);
      setError('');
      setErrorOpen(false);
   };

   const handleSetTempOrder = (tempOrderForUpdate) => {
      console.log(tempOrderForUpdate)
      setTempOrder(tempOrderForUpdate);
   };

   const handleLoadCartItems  = (orderItemsList) => {
      setOrderItemList(orderItemsList);
   };
   
   const handleSetItems = (itemList) => {
      setAllItems(itemList);
   };

   const handlePopupToggle = (type) => {
      setPopupType(type);
      setPopupOpen(true);
   };

   const handlePopupClose = (type) => {
      setPopupType('');
      setPopupOpen(false);
   };

   const handleSearchItem = (searchItemText) => {
      const searchItemList = [];
      if (searchItemText.trim() !== "") {
         allItems.forEach((item) => {
            if (item.itemName.toLowerCase().includes(searchItemText.toLowerCase())) {
               searchItemList.push(item);
            }
         });
         setItemListBySearch(searchItemList);
         setShowSearchItem(true);
      } else {
         setShowSearchItem(false);
      }
   };

   const handleSetOrderList = (userOrderList) => {
      setUserOrderList(userOrderList);
   };

   const handleSetFavoriteItemList = (favoriteItemList) => {
      setFavoriteItemList(favoriteItemList);
   };

   const handleRemoveFromFavorite = (item) => {
      setFavoriteItemList((favoriteItemList) =>
      favoriteItemList.filter((favoriteItem) => favoriteItem.itemId !== item.itemId));
   };

   const handleRemoveCartItems = () => {
      setOrderItemList([]);
      getAllItems().then(response => {
         setAllItems(response.data);
      })
   };

   const handleLogout = () => {
      setOrderItemList([]);
      setFavoriteItemList([]);
      setUserOrderList([]);
   };

   const handleAddToOrder = (item) => {
      setOrderItemList((prevOrderItemList) => [
         ...(prevOrderItemList?.filter((orderItem) => orderItem.itemId !== item.itemId) ?? []),
         item,
      ]);
   };

   const handleAddToFavorite = (item) => {
      setFavoriteItemList([...favoriteItemList, item]);
   };

   const handleAddNewOrder = (order) => {
      setTempOrder(order);
      setUserOrderList([...userOrderList, order]);
   };

   const handleRemoveFromOrder = (item) => {
      setOrderItemList((orderItemList) => {
         if (orderItemList) {
            return orderItemList.filter((orderItem) => orderItem.itemId !== item.itemId);
         } else {
            return [];
         }
      });
   };
      
   const handleUpdateQuantity = (item, newQuantity) => {
      const updatedOrderItemList = [...orderItemList];
      const index = updatedOrderItemList.findIndex(orderItem => orderItem.itemId === item.itemId);
      if (index !== -1) {
         updatedOrderItemList[index].quantity = newQuantity;
        setOrderItemList(updatedOrderItemList);
      }
    };

   const handleDisplayItem = (item) => {
      localStorage.setItem('selectedItem', JSON.stringify(item));
      setSelectedItem(item);
   }

   const handleChangeShippingAddress = (shippingAddress) => {
      tempOrder.city = shippingAddress.city;
      tempOrder.street = shippingAddress.street;
      tempOrder.buildingNumber = shippingAddress.buildingNumber;
      tempOrder.apartment = shippingAddress.apartment;
      const findOrder = userOrderList.find((order) => order.orderId === shippingAddress.orderId);
      console.log(userOrderList)
      if (findOrder) {
         findOrder.city = shippingAddress.city;
         findOrder.street = shippingAddress.street;
         findOrder.buildingNumber = shippingAddress.buildingNumber;
         findOrder.apartment = shippingAddress.apartment;
      }
   };

   const handleDeleteOrder = (orderId) => {
      setUserOrderList((userOrderList) =>
      userOrderList.filter((order) => order.orderId !== orderId));
      setOrderItemList((orderItemList) =>
      orderItemList.filter((item) => item.orderId !== orderId));
   };
   
   
   return (
      <>
      <AuthProvider>
         <NavigationBar
            onPopupToggle={handlePopupToggle}
            onSearchItems={handleSearchItem}
            onLogout={handleLogout}
            onPopupCloes={handlePopupClose} 
            messageDisplay={handleSetMessage}
            errorDisplay={handleSetError}  
         />
         {isPopupOpen && 
         <RegistrationPopup
            onPopupToggle={handlePopupToggle}
            popupType={popupType}
            onPopupCloes={handlePopupClose} 
            onLoadFavoriteItem={handleSetFavoriteItemList}
            onLoadCartItem={handleLoadCartItems}
            onLogout={handleLogout}
            onLoadOrderList={handleSetOrderList}
            onChangeShippingAddress={handleChangeShippingAddress}
            onLoadTempOrder = {handleSetTempOrder}
            tempOrder ={tempOrder}
            messageDisplay={handleSetMessage}
            errorDisplay={handleSetError}   
         />}

         {isMessageOpen && message && 
         <MessagePopup
            isMessageOpen={isMessageOpen}
            isErrorOpen={isErrorOpen}
            message={message}
            error={error}
            onMessageCloes={handleMessageClose} 
         />}

         {isErrorOpen && error && 
         <MessagePopup
            isMessageOpen={isMessageOpen}
            isErrorOpen={isErrorOpen}
            message={message}
            error={error}
            onMessageCloes={handleMessageClose} 
         />}   

         <Routes>

            <Route path="/" element=
               {<Home
                  messageDisplay={handleSetMessage}
                  errorDisplay={handleSetError}   
                  userOrderList={userOrderList}
                  itemListForDisplay={showSearchItem ? itemListBySearch : allItems}
                  favoriteItemList = {favoriteItemList}
                  orderItemList = {orderItemList}
                  onPopupToggle={handlePopupToggle}
                  onAddToFavorite={handleAddToFavorite}
                  onRemoveFromFavorite={handleRemoveFromFavorite}
                  onAddToOrder={handleAddToOrder}
                  onRemoveFromOrder={handleRemoveFromOrder}
                  onSelectItem={handleDisplayItem}
                  onAddNewOrder={handleAddNewOrder}
                  onLoadCartItem={handleLoadCartItems}
                  onLoadFavoriteItem={handleSetFavoriteItemList}
                  onLoadTempOrder = {handleSetTempOrder}
                  showSearchItem = {showSearchItem}
                  onLoadItemList={handleSetItems}
               />}
            />

            <Route path="/favoriteItems" element=
               {<FavoriteList 
                  messageDisplay={handleSetMessage}
                  errorDisplay={handleSetError}   
                  onLoadFavoriteItem={handleSetFavoriteItemList}
                  onLoadCartItem={handleLoadCartItems}
                  onLoadTempOrder = {handleSetTempOrder}
                  userOrderList={userOrderList}
                  orderItemList = {orderItemList}
                  favoriteItemList = {favoriteItemList}
                  onRemoveFromFavorite={handleRemoveFromFavorite}
                  onAddToOrder={handleAddToOrder}
                  onRemoveFromOrder={handleRemoveFromOrder}
                  onSelectItem={handleDisplayItem}
                  onAddNewOrder={handleAddNewOrder}
               />}
            />

            <Route path="/cart" element=
               {<CartList 
               messageDisplay={handleSetMessage}
               errorDisplay={handleSetError}
               onLoadTempOrder = {handleSetTempOrder}
               userOrderList={userOrderList}
               orderItemList = {orderItemList}
               favoriteItemList = {favoriteItemList}
               onLoadCartItem={handleLoadCartItems}
               tempOrder = {tempOrder}
               onRemoveFromOrder={handleRemoveFromOrder}
               onAddToFavorite={handleAddToFavorite}
               onRemoveFromFavorite={handleRemoveFromFavorite}
               onCloseTempOrder={handleRemoveCartItems}
               onUpdateQuantity={handleUpdateQuantity}
               onSelectItem={handleDisplayItem}
               onPopupToggle={handlePopupToggle}
               />}
            />

            <Route path="/orders" element=
               {<Order 
                  messageDisplay={handleSetMessage}
                  errorDisplay={handleSetError}   
                  userOrderList={userOrderList}
                  onDeleteOrder={handleDeleteOrder}
                  onLoadOrderList={handleSetOrderList}
               />}
            />
            <Route path="/item" element=
               {<Item 
                  messageDisplay={handleSetMessage}
                  errorDisplay={handleSetError}        
                  onAddNewOrder={handleAddNewOrder}
                  onLoadCartItem={handleAddToOrder}
                  onLoadFavoriteItem={handleSetFavoriteItemList}
                  onPopupToggle={handlePopupToggle}
                  onLoadItemList={handleSetItems}
                  allItems = {allItems}
                  userOrderList={userOrderList}
                  itemListForDisplay={showSearchItem ? itemListBySearch : allItems}
                  favoriteItemList = {favoriteItemList}
                  orderItemList = {orderItemList}
                  onAddToFavorite={handleAddToFavorite}
                  onRemoveFromFavorite={handleRemoveFromFavorite}
                  onAddToOrder={handleAddToOrder}
                  onRemoveFromOrder={handleRemoveFromOrder}
                  item={selectedItem}
               />}
            />
         </Routes>

         <Footer
            onPopupToggle={handlePopupToggle}
            onSearchItems={handleSearchItem}
            onLogout={handleLogout}
         />
         
      </AuthProvider>
      </>
   );
   
}


export default App;