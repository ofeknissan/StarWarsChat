<p align="center">
  <img width="200"  src="https://i.imgur.com/u54eVyj.png" />
</p>

# Star Wars Chat

Chatting Platform

## Description

* A web client coded with JavaScript / Html / CSS
* Using React framework

## Authors

* Tamir Yashin  213335094
* Ofek  Nissan  325048015

## Getting Started

### Dependencies

#### Front-end:
* react
* react-bootstrap
* react-router-dom

#### Back-end:
* @microsoft/signalr
* Microsoft.AspNetCore.Authentication.JwtBearer
* Microsoft.EntityFrameworkCore.SqlServer
* Microsoft.EntityFrameworkCore.Tools
* Pomelo.EntityFrameworkCore.MySql
* Swashbuckle.AspNetCore
* Microsoft.VisualStudio.Web.CodeGeneration.Design

### Installing

* git clone https://github.com/ofeknissan/StarWarsChat.git
* cd StarWarsChat
* cd "Front end"
* npm install
* open "Backend" visual studio project
* in "appsettings.json" change connectionstring password to match mariadb password

### Executing program

* in StartWarsChat/Front end:
  * npm start
* in Backend visual studio project:
  * run the server 

### How to test the system

* To access the chat:
  * Visit http://localhost:3000/
  * Register:
    * click on the link on the bottom right of the login page.
  ##### OR
  * Login:
    * Enter username and password and click submit.
* In the chat:
  * Add contact with the button near your name.
  * Click on existing contacts to chat with them.
* Rating Application:
  * Visit http://localhost:3000/ OR http://localhost:3000/signup
  * Click on the rate us link on the bottom left.
  * Add rating with the *rate us* button.
  * Edit/display/delete rating by using the buttons in the table.
  * Search ratings by their description.
  

### Bonus features
                         
* chat window:
  * emoji picker - using the emoji button next to new message box
  * send location in chat - using the paperclip button and pressing on the location icon
  * send file in chat - using the paperclip button and pressing on the file icon
  * image preview - clicking on the contact image above the selected chat (after selecting a contact to chat with)
* server:
  * JWT token

