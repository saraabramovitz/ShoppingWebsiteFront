import {axiosInstance as axios} from './axiosInstance'

const GET_ALL_ITEMS = () => 'item/all';
const GET_ITEMS_CONTAINING_SEARCH_TEXT = (searchText) => `item/containingSearchText/${searchText}`;

const CREATE_USER = () => `user/create`;
const AUTHENTICATE_USER = () => `user/authenticate`;
const DELETE_USER = (userId) => `user/delete/${userId}`;
const GET_USER_BY_USERNAME = (username) => `user/getByUsername/${username}`;

const UPDATE_SHIPPING_ADDRESS = () => 'order/updateShippingAddress';
const CLOSE_ORDER = (orderId) => `order/closeOrder/${orderId}`;
const GET_USER_ORDERS = (userId) => `order/getByUser/${userId}`;
const GET_TEMP_ORDER_BY_USER = (userId) =>`order/getTempOrderByUser/${userId}`
const DELETE_ORDER = (orderId) => `order/delete/${orderId}`;


const CREATE_ORDER_ITEM = () => `orderItem/create`;
const UPDATE_ORDER_ITEM_QUANTITY = () => `orderItem/updateQuantity`;
const DELETE_ORDER_ITEM = (itemId) => `orderItem/delete/${itemId}`;
const GET_TEMP_ORDER_ITEM = (userId) => `orderItem/getByTempOrder/${userId}`
const GET_ORDER_ITEMS = (orderId) => `orderItem/getByOrderId/${orderId}`

const CREATE_FAVORITE_ITEM = () => `favoriteItem/create`;
const DELETE_FAVORITE_ITEM = (favoriteItemId) => `favoriteItem/delete/${favoriteItemId}`;
const DELETE_ALL_USER_FAVORITE_ITEM = () => `favoriteItem/delete/byUserId`;
const GET_USER_FAVORITE_ITEM = (userId) => `favoriteItem/all/byUserId/${userId}`;

export const getAllItems = () => {
   return axios.get(GET_ALL_ITEMS());
};

export const getItemsContainingSearchText = (searchText) => {
   return axios.get(GET_ITEMS_CONTAINING_SEARCH_TEXT(searchText));
};


export const createUser = (userBody) => {
   return axios.post(CREATE_USER(), userBody);
};

export const authenticateUser = (userBody) => {
   return axios.post(AUTHENTICATE_USER(), userBody);
};

export const deleteUser = (params, userId) => {
   return axios.delete(DELETE_USER(userId), {params: params});
};

export const getUserByUsername = (username) =>{
   return axios.get(GET_USER_BY_USERNAME(username))
};

export const updateShippingAddress = (params, requestBody) => {
   return axios.put(UPDATE_SHIPPING_ADDRESS(),requestBody, {params: params});
};

export const closeOrder = (params, orderId) => {
   return axios.put(CLOSE_ORDER(orderId), null, { params: params });
};

export const deleteOrderById = (params, orderId) => {
   return axios.delete(DELETE_ORDER(orderId), {params: params});
};

export const getOrdersByUserId = (params, userId) => {
   return axios.get(GET_USER_ORDERS(userId), {params: params});
};

export const getTempOrderByUser = (params, userId) => {
   return axios.get(GET_TEMP_ORDER_BY_USER(userId), {params: params});
};

export const createOrderItem = (params, requestBody) => {
   return axios.post(CREATE_ORDER_ITEM(),requestBody , {params: params});
};

export const updateOrderItemQuantity = (params, requestBody) => {
   return axios.put(UPDATE_ORDER_ITEM_QUANTITY(),requestBody, {params: params});
};

export const deleteOrderItemById = (params, orderItemId) => {
   return axios.delete(DELETE_ORDER_ITEM(orderItemId), {params: params});
}

export const getOrderItemsByTempOrder = (params, userId) => {
   return axios.get(GET_TEMP_ORDER_ITEM(userId), {params: params});
};

export const getOrderItemsByOrderId = (params, orderId) => {
   return axios.get(GET_ORDER_ITEMS(orderId), {params: params});
};

export const createFavoriteItem = (params, requestBody) => {
   return axios.post(CREATE_FAVORITE_ITEM(),requestBody , {params: params});
};

export const deleteFavoriteItem = (params, favoriteItemId) => {
   return axios.delete(DELETE_FAVORITE_ITEM(favoriteItemId), {params: params});
};

export const deleteFavoriteItemByUserId = (userId) => {
   return axios.delete(DELETE_ALL_USER_FAVORITE_ITEM(userId));
};

export const getAllFavoriteItemsByUserId = (params, userId) => {
   return axios.get(GET_USER_FAVORITE_ITEM(userId), {params: params});
};