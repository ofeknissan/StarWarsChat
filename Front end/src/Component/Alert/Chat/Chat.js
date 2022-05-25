import React, { useEffect, useRef, useState } from "react";
import { getUserData, isExist } from "../../Util/submitHandler";
import Message from "../../Util/Message";
import "./Chat.css";
import UserDeatils from "../UserDeatils/UserDeatils";
import ContactDetails from "../ContactDetails/ContactDetails";
import ToolBox from "../ToolBox/ToolBox";
import ContactChat from "../ContactChat/ContactChat";
import { getContacts } from "../../Util/userMessages";
import { forEach } from "../ToolBox/EmojiPicker/Emojis";
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useNavigate } from "react-router";

const Chat = () => {
  //get params from URL
  console.log("rendered");
  const myName = localStorage.getItem("Username");
  const [currentContact, setCurrentContact] = useState({
    contact: "",
    img: "",
    display: "",
    messages: [],
    server: ""
  });
  const currentContactRef = React.useRef(currentContact);
  const _setCurrentContact = data => {
    currentContactRef.current = data;
    setCurrentContact(data);
  }
  console.log("current contact:");
  console.log(currentContact);
  
  const [contacts, setContacts] = useState({});
  const contactsRef = React.useRef(contacts);
  const _setContacts = data => {
    contactsRef.current = data;
    setContacts(data);
  }


  const [contactsList, setContactsList] = useState({});
  const contactsListRef = React.useRef(contactsList);
  const _setContactsList = data => {
    contactsListRef.current = data;
    setContactsList(data);
  }
  const [ connection, setConnection ] = useState(null);

  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    //TODO - CHECK IF usedata NULL
    async function fetchData() {
      var userDataRes = await getUserData(setLoggedOut);
      var contactsRes = await getContacts(setLoggedOut);
      setUserData({ ...userDataRes });
      _setContacts({ ...contactsRes });
      _setContactsList({ ...contactsRes });
    }
    fetchData();
  }, []);


 
  const [loggedOut, setLoggedOut] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (loggedOut) {
      return navigate("/");
    }
  }, [loggedOut]);


  useEffect(() => {
      const newConnection = new HubConnectionBuilder()
          .withUrl('http://localhost:5018/Chathub')
          .withAutomaticReconnect()
          .build();

      setConnection(newConnection);
  }, []);

  useEffect(() => {
      if (connection) {
          connection.start()
              .then(result => {
                  console.log('Connected!');
  
                   connection.on('ReceiveMessage' + myName, alert => {
                      contactsListRef.current[alert.contactName].lastdate = alert.message.created;
                      contactsListRef.current[alert.contactName].last = alert.message.content;
                      const current = currentContactRef.current
                      if(current.contact == alert.contactName) {
                        var currentMsg = current.messages;
                        currentMsg.push(alert.message);
                        _setCurrentContact({contact:current.contact, display: current.display, messages:currentMsg, server:current.server, img:current.img})
                      }
                      _setCurrentContact({contact:current.contact, display: current.display, messages:current.messages, server:current.server, img:current.img})
                    });
                    connection.on('AddContact' + myName, alert => {
                      let temp = contactsRef.current;
                      temp[alert.id] = alert;
                      _setContacts({ ...temp });
                      _setContactsList({ ...temp });


                      // contactsListRef.current[alert.contactName].lastdate = alert.message.created;
                      // contactsListRef.current[alert.contactName].last = alert.message.content;
                      // const current = currentContactRef.current
                      // if(current.contact == alert.contactName) {
                      //   var currentMsg = current.messages;
                      //   currentMsg.push(alert.message);
                      //   _setCurrentContact({contact:current.contact, display: current.display, messages:currentMsg, server:current.server, img:current.img})
                      // }
                      // _setCurrentContact({contact:current.contact, display: current.display, messages:current.messages, server:current.server, img:current.img})
                    });
              })
              .catch(e => console.log('Connection failed: ', e));
      }
  }, [connection]);

  async function addNewContact(username, nickname, server) {
    const token = localStorage.getItem("Authentication");
    if (myName === username) {
      return {flag: false, errorMsg: "Contact cannot be added"};
    }
    //send to our server
    let res = await fetch("http://localhost:5018/api/contacts/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ id: username, name: nickname, server: server }),
    });
    if(!res.ok) {
      if(res.status == 409){
        return {flag: false, errorMsg: "Contact already exists!"};
      } else if(res.status == 401){
        setLoggedOut(true);
      } else {
        return {flag: false, errorMsg: "Failed to send request to server, try again later!"};
      }
    }
    //send to other server
    res = await fetch("http://"+ server + "/api/invitations/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: myName, to: username, server: "localhost:5018" }),//TODO ADD REAL SERVER
      });
      if(res.ok) {
        //success, add to contacts
        let temp = contacts;
        temp[username] = {id: username, name: nickname, server: server, last: null, lastDate: null}
        _setContacts({ ...temp });
        _setContactsList({ ...temp });
        return {flag: true, errorMsg: "Success"};
      } else {
        //failure, remove from our server
        res = await fetch("http://localhost:5018/api/contacts/"+ username, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if(res.status == 401){
          setLoggedOut(true);
        }
          return {flag: false, errorMsg: "Failed to send request to server, try again later!"};
      } 
  }
  console.log("contacts: ");
  console.log(contacts);
  console.log("contactsList: ");
  console.log(contactsList);
  let keys = Object.keys(contactsList);
  console.log("KEYS: ");
  console.log(keys);
  const last_message = (message) => {
    if (message.type == "voice") {
      return "Voice Message";
    } else if (message.type == "image") {
      return "Image Message";
    } else if (message.type == "video") {
      return "Video Message";
    } else if (message.type == "file") {
      return "File Message";
    } else if (message.type == "geo") {
      return "Location Message";
    }
    return message.data;
  };

  async function addMessage(message, format, contactName, serverContact) {
    const token = localStorage.getItem("Authentication");
    console.log("serverContact " + serverContact );
    const res = await fetch("http://localhost:5018/api/contacts/" + contactName + "/messages", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ content: message, type: format }),
    });
    if(res.status == 401){
      setLoggedOut(true);
    }
    else if(res.ok) {
      let lastMessage = await fetch("http://localhost:5018/api/contacts/lastMessage/" + contactName, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }        
      });
      const messageToJson = await lastMessage.json();
      currentContact.messages.push(messageToJson);
      contactsList[contactName].lastdate = messageToJson.created;
      contactsList[contactName].last = messageToJson.content;
      // Transfer To the contact server
      await fetch("http://"+ serverContact +"/api/transfer/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({from: myName, to: contactName, content: message})
      }).catch(err => console.log("yolo"))
    } 
    else {
      const FailedMessage = {content: message, sent:'True', Failed: true}
      currentContact.messages.push(FailedMessage);
      contactsList[contactName].lastdate = "Failed To Send Message";
      contactsList[contactName].last = message;
    }
    _setCurrentContact({contact: contactName, img: currentContact.img, display: currentContact.display, messages: currentContact.messages, server: currentContact.server});
  }

  const contactList = keys.map((contact, key) => {
    let nameVal =  contactsList[contact].id;
    let displayVal = contactsList[contact].name;
    let server = contactsList[contact].server;
    let isClickedVal = currentContact.contact === contact;
    let onClickFunc = async (contact, img, display, server) => {   
      const token = localStorage.getItem("Authentication");
      var messages = [];
      const res = await fetch(
        "http://localhost:5018/api/contacts/" + contact + "/messages",
        {
          method: "Get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (res.ok) {
          // True =  user doesnt exist in DB.
          messages = await res.json();
        } else if(res.status == 401){
          setLoggedOut(true);
        }
        _setCurrentContact({
          contact: contact,
          img: img,
          display: display,
          messages: messages,
          server:server,
        });
      
    };
    //let imgVal = contactsList[contact].image;
    let imgVal = "./Images/user2.png";
    let lastMsgDate = contactsList[contact].lastdate;
    let lastMsg = contactsList[contact].last;

    if (lastMsg == null || lastMsgDate == null) {
      return (
        <ContactDetails
          name={nameVal}
          display={displayVal}
          isClicked={isClickedVal}
          onClick={onClickFunc}
          img={imgVal}
          key={key}
          time={null}
          server={server}
        >
          {""}
        </ContactDetails>
      );
    } else {
      return (
        <ContactDetails
          name={nameVal}
          display={displayVal}
          isClicked={isClickedVal}
          onClick={onClickFunc}
          img={imgVal}
          key={key}
          time={lastMsgDate}
          server={server}
        >
          {lastMsg}
        </ContactDetails>
      );
    }
  });

  const doSearch = (e) => {
    let contactName = Object.keys(contacts);
    contactName = contactName.filter(
      (contact) => contact.indexOf(e.target.value) == 0
    );
    let specificContacts = {};
    contactName.forEach((item) => {
      specificContacts[item] = contacts[item];
    });
    _setContactsList(specificContacts);
  };

  return (
    <div className="chat-bg">
      <div className="container-fluid full-chat-box">
        <div className="row h-100">
          <div className="col-5 p-0 contact-bg">
            <div className="d-flex flex-column h-100">
              <UserDeatils onsubmit={addNewContact} img={userData.image}>
                {myName}
                {userData.display}
              </UserDeatils>
              <div className="searchBar">
                <form
                  className="form-inline"
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <input
                    className="form-control mr-sm-2 search-bar"
                    type="search"
                    placeholder="Search Contact By Username"
                    aria-label="Search"
                    onChange={doSearch}
                  />
                </form>
              </div>
              <div className="contact-box">
                <div className="contact-content">{contactList}</div>
              </div>
            </div>
          </div>
          <div className="col-7 p-0 flex contact-char-bg">
            <div className="d-flex flex-column h-100">
              <ContactChat
                isDefault={currentContact.contact === ""}
                messages={currentContact.messages}
                currentContact={currentContact}
              />
              {!(currentContact.contact === "") && (
                <ToolBox addMessage={addMessage} contactServer={currentContact.server} contactName={currentContact.contact}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
