import { createFavoriteItem, deleteFavoriteItem, createOrderItem, deleteOrderItemById, getOrderItemsByTempOrder} from "../../services/api";

   const isFavoriteItemExist = (itemId, favoriteItemList) => {
      const foundFavoriteItem = favoriteItemList.find(favoriteItem => favoriteItem.itemId === itemId);
      return foundFavoriteItem ? foundFavoriteItem : null;
   };

   const handleCreateFavoriteItem = async (requestBody, params, item) => {
      try {
         const favoriteItemResponse = await createFavoriteItem(params, requestBody);
         const userId = requestBody.userId;
         const favoriteItemId = favoriteItemResponse.data;
         const favoriteItem = { favoriteItemId: favoriteItemId, ...item, userId: userId };
         return favoriteItem;
      } catch (err) {
         console.log("Error creating favorite item :", err.message);
      }
   };

   const handleDeleteFavoriteItem = async (params, favoriteItemId) => {
      try {
      await deleteFavoriteItem(params, favoriteItemId);
      } catch (err) {
         console.log("Error deleting favorite item :", err.message);
      }
   };  

   const isOrderItemExist = (itemId, orderItemList) => {
      if(orderItemList){
         const foundCartItem = orderItemList.find(orderItem => orderItem.itemId === itemId);
         return foundCartItem ? foundCartItem : null;
      }
   };
  
   const isOrderExist = (orderId, userOrderList) => {
      return userOrderList.some((order) => order.orderId === orderId);
   }

   const handleCreateOrderItem = async (requestBody, params, item) => {
         const orderItemResponse = (await createOrderItem(params, requestBody));
         const orderItemData = orderItemResponse.data;
         const orderItem = { ...item, orderId: orderItemData.orderId, orderItemId: orderItemData.orderItemId, quantity: orderItemData.quantity};    
         return orderItem;
   };

   const handleDeleteOrderItem = async (orderItem, params) => {
      try {
         await deleteOrderItemById(params, orderItem.orderItemId);
      } catch (err) {
         console.log("Error deleting order item :", err.message);
      }
   };   
   
   const handleCreateNewOrder = (orderId, auth) => {
      const orderToCreate = {
      orderId: orderId,
      userId: auth.user.userId,
      city: auth.user.address.city, 
      street: auth.user.address.street,
      buildingNumber: auth.user.address.buildingNumber,
      apartment: auth.user.address.apartment,
      orderStatus: "TEMP" 
      }
      return orderToCreate;
   };

   const handleLoadCartItem = async (auth) => {
      try {
        const params = { "Authorization": "Bearer " + auth.token };
        const orderItemList = await getOrderItemsByTempOrder(params, auth.user.userId);
        return orderItemList.data
      } catch (err) {
         console.log("Error Load Cart Item :", err.message);
      }
    };

export { isFavoriteItemExist, handleCreateFavoriteItem, handleDeleteFavoriteItem, isOrderItemExist, isOrderExist, handleCreateOrderItem,
   handleDeleteOrderItem, handleCreateNewOrder, handleLoadCartItem
};
