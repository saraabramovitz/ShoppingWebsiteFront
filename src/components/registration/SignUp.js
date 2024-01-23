import React, {useRef, useState, useEffect} from "react";
import './Popup.css'
import {createUser} from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';


function SignUp(props) {

   const USER_REGEX = /^[A-Za-z-_]{4,24}$/;
   const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*]).{8,24}$/;

   const userRef = useRef();
   const [error, setError] = useState('');

   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [city, setCity] = useState('');
   const [street, setStreet] = useState('');
   const [buildingNumber, setBuildingNumber] = useState('');
   const [apartment, setApartment] = useState('');
   const [username, setUsername] = useState('');
   const [validUsername, setValidUsername] = useState(false);
   const [usernameFocus, setUsernameFocus] = useState(false);
   const [password, setPassword] = useState('');
   const [validPassword, setValidPassword] = useState(false);
   const [passwordFocus, setPasswordFocus] = useState(false);
   const [machPassword, setMachPassword] = useState('');
   const [validMach, setValidMach] = useState(false);
   const [machFocus, setMachFocus] = useState(false);
   const [success, setSuccess] = useState(false);



   useEffect(() => {
      userRef.current.focus();
   }, []);

   useEffect(() => {
      setValidUsername(USER_REGEX.test(username));
   }, [username])

   useEffect(() => {
      setValidPassword(PWD_REGEX.test(password));
      setValidMach(password === machPassword);
   }, [password, machPassword])

   const handleSubmit = async (event) => {
      event.preventDefault();
      try {
         const address = { city: city, street: street, buildingNumber: buildingNumber, apartment: apartment }
         const registredUser = { firstName: firstName, lastName: lastName, address: address, email: email,  phone: phoneNumber, username: username, password: password }
         await createUser(registredUser);

         setSuccess(true)
         setFirstName('');
         setLastName('');
         setEmail('');
         setPhoneNumber('');
         setCity('');
         setStreet('');
         setBuildingNumber('');
         setApartment('');
         setUsername('');
         setPassword('');
         setMachPassword('');

      } catch (err) {
         handleError(err)
      };
   }
   

   const handleError = (err) => {
      console.log(err.response)
      if (!err.response) {
         setError("No server response.");
      }
      else if (err.response.status === 400 && err.response.data === "Username is already taken") {
         setError("Username is already taken. Please choose a different one.");
      } else {
         setError("There was an error creating the user. Please try again.");
      }
  };


   return(
      <div >
      {success ? (
         <div className="popupStyle">
            <div className="popupHeader">You have registered successfuly!</div>
            <div className="space"></div>
            <button className="popupButton" onClick={() => props.onPopupToggle('login')}>log in</button>
         </div>
         ) : (
         <div className="popupStyle">
            <div className="popupHeader">Sign Up</div>
            <form onSubmit = {handleSubmit}>
               <div className="popupSecondHeader">Your details</div>
               <div className="inputRow">
                  <input className="popupInput"
                     type="text"
                     autoComplete="off"
                     ref={userRef}
                     onChange={(event) => setFirstName(event.target.value)}
                     placeholder="First name"
                     value={firstName}
                     required
                  ></input>
                  <input className="popupInput"
                     type="text"
                     autoComplete="off"
                     onChange={(event) => setLastName(event.target.value)}
                     placeholder="Last name"
                     value={lastName}
                     required
                  ></input>
               </div>
               <input className="popupInputFullLine"
                  type="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  value={email}
                  required
               ></input>
               <input className="popupInputFullLine"
                  type="tel"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="Phone number"
                  value={phoneNumber}
                  required
               ></input>
               <div className="popupSecondHeader">Your address</div>
               <input     
                  className="popupInputFullLine"    
                  type="text"
                  autoComplete="off"
                  ref={userRef}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="City"
                  value={city}
                  required
               ></input>
               <input
                  className="popupInputFullLine"
                  type="text"
                  autoComplete="off"
                  onChange={(event) => setStreet(event.target.value)}
                  placeholder="Street"
                  value={street}
                  required
               ></input>
               <div className="inputRow">
                  <input
                     className="popupInput"
                     type="number"
                     onChange={(event) => setBuildingNumber(event.target.value)}
                     placeholder="Building number"
                     value={buildingNumber}
                     required
                  ></input>
                  <input
                     className="popupInput"
                     type="number"
                     onChange={(event) => setApartment(event.target.value)}
                     placeholder="Apartment number"
                     value={apartment}
                  ></input>
               </div>    
               <div className="popupSecondHeader">Create your username and password</div>
               <input className="popupInputFullLine"
                     type="text"
                     autoComplete="off"
                     onChange={(event) => setUsername(event.target.value)}
                     onFocus={() => setUsernameFocus(true)}
                     onBlur={() => setUsernameFocus(false)}
                     placeholder="Username"
                     value={username}
                     required
               ></input>
               <div className={usernameFocus && username ? "instructionsDiv" : "hide" }>
                  <div className="instructionsIcon">{usernameFocus && username && !validUsername ? (<FontAwesomeIcon icon={faCircleXmark} />
                  ) : ( <FontAwesomeIcon icon={faCircleCheck} className="yellow"/>)
                  }</div>
                  <div className="instructionsText">4 - 24 characters. 
                     <br /> Uppercase and lowercase allowed.
                  </div>
               </div>
               <input
                  className="popupInputFullLine"
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  placeholder="Password"
                  value={password}
                  required
               ></input> 
               <div className={passwordFocus ? "instructionsDiv" : "hide"}>
                  <div className="instructionsIcon">{passwordFocus && !validPassword ? (<FontAwesomeIcon icon={faCircleXmark} />
                  ) : ( <FontAwesomeIcon icon={faCircleCheck} className="yellow"/>)
                  }</div>
                  <div className="instructionsText">8 - 24 characters.
                     <br />Must include uppercase lowercase number and special character.
                  </div>
               </div>
               <input
                  className="popupInputFullLine"
                  type="password"
                  onChange={(event) => setMachPassword(event.target.value)}
                  onFocus={() => setMachFocus(true)}
                  onBlur={() => setMachFocus(false)}
                  placeholder="Confirm password"
                  value={machPassword}
                  required
               ></input>
               <div className={machFocus ? "instructionsDiv" : "hide"}>
                  <div className="instructionsIcon">                     
                  {machFocus && !validMach ? (<FontAwesomeIcon icon={faCircleXmark} />
                  ) : ( <FontAwesomeIcon icon={faCircleCheck} className="yellow" />)
                  }</div>
                  <div className="instructionsText">Must mutch password.</div>
               </div>
               <button type ="submit" className="popupButton" disabled={!validUsername || !validPassword || !validMach ? true : false}>Sign up</button>       
            </form>
            <div className="popupSecondHeader">Already have an account? <span className="popupLinkButton" onClick={() => props.onPopupToggle('login')}>log in</span></div>
            {error && <div className="errorMessage">{error}</div>}
         </div>
         )}
      </div>
   );
   
}


export default SignUp;