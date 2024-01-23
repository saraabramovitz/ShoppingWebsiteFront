import React, { useRef, useState, useEffect, useContext } from "react";
import AuthContext from '../context/AuthProvider';
import { authenticateUser, getUserByUsername, getAllFavoriteItemsByUserId, getTempOrderByUser, getOrdersByUserId,} from '../../services/api';
import './Popup.css';


function Login(props) {

   const { setAuth } = useContext(AuthContext);
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const userRef = useRef();

   useEffect(() => {
      userRef.current.focus();
   }, []);

   const handleSubmit = async (event) => {
      event.preventDefault();
      const userAuthentication = { username: username, password: password };
      try {
         const authenticationResponse = await authenticateUser(userAuthentication);
         const user = await getUserByUsername(username);
         const token = authenticationResponse.data.jwt;
         const params = { "Authorization": "Bearer " + token };

         const favoriteItemListResponse = await getAllFavoriteItemsByUserId(params, user.data.userId);
         props.onLoadFavoriteItem(favoriteItemListResponse.data);

         const tempOrderResponse = await getTempOrderByUser(params, user.data.userId);
         props.onLoadTempOrder(tempOrderResponse.data.order)
         props.onLoadCartItem(tempOrderResponse.data.orderItems);

         const orderListResponse = await getOrdersByUserId(params, user.data.userId);
         props.onLoadOrderList(orderListResponse.data);

         setAuth({ user: user.data, token: token, isLoggedin: true });
         localStorage.setItem("token", token);
         localStorage.setItem("user", JSON.stringify(user.data));
         handleClosePopup();
      } catch (err) {
         handleError(err);
      }
   };

   const handleError = (err) => {
      if (!err.response) {
         setError("No server response.");
      } else if (err.response.status === 403) {
         setError("Your username or password are incorrect, please try again.");          
      } else {
         setError("Error occurred during the login process. Please try again.");
      }
  };

   const handleClosePopup = () => {
      props.onLoggedIn();
   };

   const handleChange = () => {
      setError('');
   };

   return (
      <div className="popupStyle">
         <div className="popupHeader">log in</div>

         <form onSubmit={handleSubmit}>
            <div className="popupSecondHeader">Put your username and password</div>
            <input
               className="popupInputFullLine"
               type="text"
               autoComplete="off"
               ref={userRef}
               onChange={(event) => {
                  handleChange();
                  setUsername(event.target.value);
               }}
               placeholder="Username"
               value={username}
               required
            />
            <input
               className="popupInputFullLine"
               type="password"
               onChange={(event) => {
                  handleChange();
                  setPassword(event.target.value);
               }}
               placeholder="Password"
               value={password}
               required
            />
            <button type="submit" className="popupButton">Login</button>
         </form>
         <div className="popupSecondHeader">
            Don't have an account? <span className="popupLinkButton" onClick={() => props.onPopupToggle('signup')}>Sign up</span>
         </div>
            {error && <div className="errorMessage">{error}</div>}
         </div>
   );

}
   
export default Login;
  