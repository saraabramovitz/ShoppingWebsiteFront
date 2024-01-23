import React, { useContext, useState } from "react";
import { useLocation, useNavigate , Link } from "react-router-dom";
import './NavigationBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faMagnifyingGlass, faUserLarge, faBars, faXmark} from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthProvider';
import { deleteUser} from '../../services/api'



function NavigationBar(props) {

   const navigate = useNavigate();
   const { setAuth, auth } = useContext(AuthContext);
   const [searchText, setSearchText] = useState('');
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const location = useLocation();

   const handleHamburgerClick = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   const handleLogout = () => {
      setAuth({ user: null, token: null, isLoggedin: false });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsMenuOpen(!isMenuOpen);
      props.onLogout();
   };
       
   const handleSubmit = (event) => {
      const currentPage = location.pathname;
      if (currentPage !== "/") {
         navigate("/"); 
      }
      event.preventDefault();
      setSearchText(searchText);
      props.onSearchItems(searchText);
      setSearchText("");
   };

   const handleLogoClick = () => {
      setSearchText("");
      props.onSearchItems(""); 
      if(!isMenuOpen){
         setIsMenuOpen(!isMenuOpen);
      }
   };
  
   const handleCheckIfLogin = (moveTo) => {
      if (auth.isLoggedin) {
         if(moveTo === "favorite"){
            navigate("/favoriteItems");
         } else if(moveTo === "cart"){
            navigate("/cart");
         }
      } else {
      props.onPopupToggle("loginRemote");
      }
   };

   const handleMenueOption = (moveTo) => {
      if (auth.isLoggedin) {
         if(moveTo === "favorite"){
            navigate("/favoriteItems");
            setIsMenuOpen(!isMenuOpen);
         } else if(moveTo === "cart"){
            navigate("/cart");
            setIsMenuOpen(!isMenuOpen);
         } else if (moveTo === "orders"){
            navigate("/orders");
            setIsMenuOpen(!isMenuOpen);
         }
      } else {
         props.onPopupToggle("loginRemote");
      }
   };


   const handleDeleteUser = async () => {
      if (auth && auth.token) {
         const params = { "Authorization": "Bearer " + auth.token };
         try{
            await deleteUser(params, auth.user.userId);
            setAuth({ user: null, token: null, isLoggedin: false });
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            props.onLogout();
            props.messageDisplay("Account has been deleted successfully.");
            props.onPopupCloes('');
         } catch (err) {
            if (!err.response) {
               props.errorDisplay("No server response.");
            } else if (err.response.status === "User does not exist") {
               props.errorDisplay("User does not exist");   
            } else {
               props.errorDisplay("Error occurred during delete user.");
            }
         }
      }
   };

   const handleRegister = () => {
      setIsMenuOpen(!isMenuOpen);
      props.onPopupToggle("registerSelect")
   }


   return (
      <div>
         <div className="navPage">
            <nav className="nav">
               <div className="logoDiv">
                  <div className="logo"><Link to="/" onClick={handleLogoClick}><img src="https://i.imgur.com/D0FJ2Tx.png" alt="Logo" /></Link></div>
               </div>
               <div className="srarchDiv">
                  <form className="searchBar" onSubmit={handleSubmit}>
                     <input 
                        className="searchInput"
                        type='text'
                        placeholder="search for item"
                        onChange={(event) => setSearchText(event.target.value)}
                        value={searchText}
                     />
                     <button className="searchButton" type='submit'><FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} /></button>
                  </form>
               </div>
               <div className="hamburgerButton"><button onClick={handleHamburgerClick}><FontAwesomeIcon icon={faBars} /></button></div>
               <div className="userDiv">
                  <button className="registerButton" onClick={() => props.onPopupToggle("registerSelect")}>
                     <FontAwesomeIcon className="registerIcon" icon={faUserLarge} />
                     {!auth.isLoggedin ? ("Log in / Sign up") : (auth.user.firstName + " " + auth.user.lastName)}
                  </button>
                  <button className="userButton" onClick={()=>handleCheckIfLogin("favorite")} ><FontAwesomeIcon icon={faHeart}/></button>
                  <button className="userButton" onClick={()=>handleCheckIfLogin("cart")} ><FontAwesomeIcon icon={faCartShopping}/></button>
               </div>
            </nav>         
         </div>
         <div className={isMenuOpen ? "menue" : "menue open"}>
            <button className="closeButton" onClick={handleHamburgerClick}><FontAwesomeIcon icon={faXmark}/></button>
            <div className="menueDiv">
               <div className="menueHeader">{auth.isLoggedin ? ("Hi " + auth.user.firstName + " " + auth.user.lastName) : ("Register in order to start shoppin")}</div>
               <button className="menueButton" onClick={()=>handleMenueOption("cart")} >My cart</button>
               <div className="menueLine"></div>
               <button className="menueButton" onClick={()=>handleMenueOption("favorite")} >My favorites</button>
               <div className="menueLine"></div>
               <button className="menueButton" onClick={()=>handleMenueOption("orders")} >My orders</button>
               <div className="menueLine"></div>
               <div>
               <button
                  className="menueRegisterButton"
                  onClick={auth.isLoggedin ? handleLogout : handleRegister}>
                  {!auth.isLoggedin ? "Register" : "Log out"}
               </button>              
               <button className="menueDeleteButton" onClick={handleDeleteUser}> {auth.isLoggedin && ("Delete my acount")}</button>
               </div>
            </div>
         </div>
      </div>
   );


}



export default NavigationBar;