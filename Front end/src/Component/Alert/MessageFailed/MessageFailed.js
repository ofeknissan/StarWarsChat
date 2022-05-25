import React from "react";
import "../TextMessage/TextMessage.css";

const TextMessage = (props) => {
  return (
    <div className="bubble-wrapper">
      <div
        className={`d-inline-flex flex-column p-2 ms-2 mb-2 bd-highlight message-reciever`}
      >
        <div className="left-point"></div>
        <div>{props.children}</div>
        <div className="ms-auto mt-2">
        <span className="message-failed">Failed!</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
export default TextMessage;
