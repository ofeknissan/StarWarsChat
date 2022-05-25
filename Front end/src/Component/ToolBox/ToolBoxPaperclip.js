import React, { useState } from "react";
import "./Toolbox.css";
import { DropdownButton } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import PaperclipIcon from "../PaperclipIcon.js";
import VoiceModal from "../VoiceModal/VoiceModal";
import ImageModal from "../ImageModal/ImageModal";


const ToolBoxPaperclip = (props) => {
  const [showAudioModal, setshowAudioModal] = useState(false);
  const handleCloseAudioModal = () => setshowAudioModal(false);
  const handleShowAudioModal = () => setshowAudioModal(true);
  const [showImageModal, setshowImageModal] = useState(false);
  const handleCloseImageModal = () => setshowImageModal(false);
  const handleShowImageModal = () => setshowImageModal(true);
  const [getHeader, setHeader] = useState("");

  function onMenuSelect(eventKey) {
    if(eventKey == 1) {
      handleShowAudioModal();
    } else if(eventKey==2) {
      setHeader("Upload Image");
    } else if(eventKey == 3) {
      setHeader("Upload Video");
    } else if(eventKey == 4) {
      setHeader("Upload File");
    } else if(eventKey == 5) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          showPosition,
          (error) => console.log(error),
          { enableHighAccuracy: true }
        );
      } 
    }
    if(eventKey == 2 || eventKey == 3 || eventKey == 4) {
      handleShowImageModal();
    }
  }

  function showPosition(position) {
    props.addMessage(position.coords.latitude + "," + position.coords.longitude, "geo", props.contact, props.server)
}

  return (
    <div className="ms-2">
      <Dropdown
        variant=""
        onSelect={(eventKey, event) => {
          onMenuSelect(eventKey);
        }}
      >
        <DropdownButton
          drop="up"
          variant="light my-dropdown-toggle"
          title={<PaperclipIcon></PaperclipIcon>}
        >
          <Dropdown.Item eventKey="1" className="drowpdownItem">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-mic"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
              <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
            </svg>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-image"
              viewBox="0 0 16 16"
            >
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
            </svg>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              classname="bi bi-film"
              viewBox="0 0 16 16"
            >
              <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
            </svg>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              classname="bi bi-file-earmark"
              viewBox="0 0 16 16"
            >
              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
            </svg>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              classname="bi bi-geo-alt"
              viewBox="0 0 16 16"
            >
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
          </Dropdown.Item>
        </DropdownButton>
      </Dropdown>
      <VoiceModal
        addMessage={props.addMessage}
        show={showAudioModal}
        handleShow={handleShowAudioModal}
        handleClose={handleCloseAudioModal}
      />
      <ImageModal
        addMessage={props.addMessage}
        show={showImageModal}
        handleShow={handleShowImageModal}
        handleClose={handleCloseImageModal}
        header={getHeader}
      />
    </div>
  );
};

export default ToolBoxPaperclip;
