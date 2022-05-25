import React, { useEffect, useRef } from "react";
import TextMessage from "../TextMessage/TextMessage";
import VoiceMessage from "../VoiceMessage/VoiceMessage";
import "./ContactChat.css";
import CurrentContactDetails from "../CurrentContactDetails/CurrentContactDetails";
import ImageMessage from "../ImageMessage/ImageMessage";
import VideoMessage from "../VideoMessage/VideoMessage";
import FileMessage from "../FileMessage/FileMessage"
import GeoMessage from "../GeoMessage/GeoMessage"
import MessageFailed from "../MessageFailed/MessageFailed"

const ContactChat = (props) => {
  console.log("messages:")
  console.log(props.messages)
  const contactId = props.contactId;
  const messages = useRef(null);
  useEffect(() => {
    if (messages.current) {
      messages.current.scrollTop = messages.current.scrollHeight;
    }
  },);

  const getHour = (time) =>{
      return time.split('T')[1].substring(0,5);
  }
  if (props.isDefault) {
    return (
      <div className="flex-grow-1 default-contact">
        <br/>
        <center>
        <h2 className="text-light">Welcome to Star Wars Chat</h2>
        <br/>
        <img className="default-image" src="/images/darth-vader-face.png"/>
        </center>
      </div>
    );
  }
  return (
    <div className="flex-grow-1 d-flex flex-column">
      <CurrentContactDetails img={props.currentContact.img}>
        {" "}
        {props.currentContact.display}{" "}
      </CurrentContactDetails>
      <div ref={messages} className="flex-grow-1 overflow-chat overflow-auto">
        <div
          className="d-flex flex-column align-items-start  justify-content-end px-3"
        >
          {props.messages.map((message, key) => {
            if(message.Failed != undefined) {
              return <MessageFailed> {message.content}</MessageFailed>
            }
            var messageTime = getHour(message.created);
            const isSenderMessage = (message.sent === 'False')
            if(message.type == "Text") {
              return (
                <TextMessage id={message.id} time={messageTime} isSender={isSenderMessage} key={key}>
                  {message.content}
                </TextMessage>
              );
            } else if(message.type == "voice") {
              return (
                <VoiceMessage id={message.id} time={messageTime} isSender={isSenderMessage} key={key}>
                  {message.content}
                </VoiceMessage>
              );
            } else if(message.type == "image") {
              return (
                <ImageMessage id={message.id} time={messageTime} isSender={isSenderMessage} key={key}>
                  {message.content}
                </ImageMessage>
              );
            } else if(message.type == "video") {
              return (
                <VideoMessage id={message.id} time={messageTime} isSender={isSenderMessage} key={key}>
                  {message.content}
                </VideoMessage>
              );
            } else if(message.type == "file") {
              return (
                <FileMessage id={message.id} time={messageTime} isSender={isSenderMessage} key={key}>
                  {message.content}
                </FileMessage>
              );
            } else if(message.type == "geo") {
              return (
                <GeoMessage id={message.id} time={messageTime} isSender={isSenderMessage} key={key}>
                  {message.content}
                </GeoMessage>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactChat;
