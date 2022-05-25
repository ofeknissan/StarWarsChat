import {addNewToContacts} from "./userMessages";

const errorMsg = ["", "Please fill all required fields!", "Wrong username or password!", "Password does not meet the requirements!", "Username already taken!", "Passwords do not match!"]

export async function submitSignIn(name, password) {
  if(name == "" || password == ""){
    return {message : errorMsg[1], userData : ""}
  }
  const res = await fetch("http://localhost:5018/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Username: name, Password: password }),
  });
  if (res.ok) { // True =  user exist in DB.
    const userData = await res.json();
    const decodedUserData = decodeJWTResult(userData);
    localStorage.setItem('Authentication', userData);
    localStorage.setItem('Username', decodedUserData.UserId);
    return {message : errorMsg[0], userData : userData};
  } else {
    return {message : errorMsg[2], userData : ""};
  }
}



export async function submitSignUp(name, password, confirmPass, nickName, image) {
  let regHasLetter = /[A-Z|a-z]/;
  let regHasNumber = /[0-9]/;
  let regLength = /^[\s\S]{5,18}$/;
  if(!regHasLetter.test(password) || !regHasNumber.test(password) || !regLength.test(password)){
    return {message : errorMsg[3], userData : ""};
  }
  if(name == "" || password == ""||nickName =="" /*|| image == null*/ || confirmPass=="") {
    return {message : errorMsg[1], userData : ""}
  }
  if(password != confirmPass){
    return {message: errorMsg[5], userData: ""}
  }
  //login:
  const res = await fetch("http://localhost:5018/api/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Username: name, Password: password, Displayname: nickName, Server:"localhost:5018", Image: "./Images/user1.png" }),
  });
  if (res.ok) { // True =  user doesnt exist in DB.
    const userData = await res.json();
    const decodedUserData = decodeJWTResult(userData);
    localStorage.setItem('Authentication', userData);
    localStorage.setItem('Username', decodedUserData.UserId);
    return {message : errorMsg[0], userData : userData};
  } else {
    return {message : errorMsg[4], userData : ""};
  }
}

export function decodeJWTResult(token){
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


export async function getUserData(setLoggedOut){
  const token = localStorage.getItem("Authentication")
  const res = await fetch("http://localhost:5018/api/user/"+localStorage.getItem("Username"), {
    method: "Get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer "+token,
    } 
   });
  if (res.ok) { // True =  user doesnt exist in DB.
    const userData = await res.json();
    return userData
  } else if(res.status == 401){
    setLoggedOut(true);
  }
  return null
}



