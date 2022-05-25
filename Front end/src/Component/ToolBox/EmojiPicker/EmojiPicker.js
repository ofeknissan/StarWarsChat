import React from 'react'
import { DropdownButton } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import emojis from './Emojis'
import "./EmojiPicker.css"

const EmojiPicker = (props) => {
    return (
      <div className="ms-2">
        <Dropdown>
          <DropdownButton
            drop="up"
            variant="light my-dropdown-toggle"
            title={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-emoji-smile"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
              </svg>
            }
          >
            <Dropdown.Item eventKey="1">
              <div className='d-flex flex-wrap emoji-desk'>
                {emojis.map((emoji, key) => {
                  return <div onClick={(e)=>{e.preventDefault(); props.message.current.value+=emoji;}} className='p-2 specific-emoji' key={key}>{emoji}</div>
                })}
              </div>
            </Dropdown.Item>
          </DropdownButton>
        </Dropdown>
      </div>
    );
}

export default EmojiPicker