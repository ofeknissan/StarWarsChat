import React, { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./VoiceModal.css";

class AudioRecorder {
  constructor() {
    this.audioBlobs = [];
    this.mediaRecorder = null;
    this.streamBeingCaptured = null;
  }

  start() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error(
          "Browser does not support."
        )
      );
    } else {
      return (
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            audioRecorder.streamBeingCaptured = stream;
            audioRecorder.mediaRecorder = new MediaRecorder(stream);
            audioRecorder.audioBlobs = [];
            audioRecorder.mediaRecorder.addEventListener("dataavailable",(event) => {audioRecorder.audioBlobs.push(event.data);});
            audioRecorder.mediaRecorder.start();
          })
      );
    }
  }

  stop() {
    return new Promise((resolve) => {
      audioRecorder.mediaRecorder.addEventListener("stop", () => {
        let audioBlob = new Blob(audioRecorder.audioBlobs);
        resolve(audioBlob);});
      audioRecorder.cancel();
    });
  }
  cancel() {
    audioRecorder.mediaRecorder.stop();
    audioRecorder.stopStream();
    audioRecorder.resetRecordingProperties();
  }
  stopStream() {
    audioRecorder.streamBeingCaptured.getTracks().forEach((track)=> track.stop()); 
  }
  resetRecordingProperties() {
    audioRecorder.mediaRecorder = null;
    audioRecorder.streamBeingCaptured = null;
  }
}

var audioRecorder = new AudioRecorder();
function VoiceModal(props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSend, setSend] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  function handleOnHide() {
    closeAndReset();
    audioRecorder.cancel();
  }
  function closeAndReset() {
    setSend(false);
    setAudioUrl(null);
    setIsRecording(false);
    props.handleClose();
  }
  function handleStop() {
    audioRecorder.stop().then((audioAsblob) => {
      let url = URL.createObjectURL(audioAsblob);
      setIsRecording(false);
      setAudioUrl(url);
      setSend(true);
    });
  }
  function handleRecord() {
    audioRecorder.start().then(() => {
      setIsRecording(true);
      setSend(false);
    });
  }

  function handleSend() {
    props.addMessage(audioUrl, "voice");
    closeAndReset();
  }
  return (
    <>
      <Modal
        show={props.show}
        onHide={handleOnHide}
        backdrop="static"
        keyboard={false}
        centered

      >
        <Modal.Header closeButton>
          <Modal.Title>Record Voice Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="divv1">
          <span className="midd1">
          <button
            type="button"
            onClick={() => {
              handleRecord();
            }}
            className="btn btn-primary"
            disabled={isRecording && "disabled"}
          >
            Record
          </button>
          <button
            type="button"
            onClick={() => {
              handleStop();
            }}
            className="btn btn-primary ms-2"
            disabled={!isRecording && "disabled"}
          >
            Stop Recording
          </button>
          <button
            type="button"
            onClick={() => {
              handleSend();
            }}
            className="btn btn-primary ms-2"
            disabled={!isSend && "disabled"}
          >
            Send
          </button>
          {isSend && (
            <audio controls className="mt-4">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          )}
          </span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOnHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default VoiceModal;
