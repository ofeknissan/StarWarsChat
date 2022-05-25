#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatServer.Data;
using ChatServer.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using ChatServer.Hubs;
using Microsoft.AspNetCore.SignalR;
using ChatServer.Services;
namespace ChatServer.Controllers
{
    [Route("api/[action]")]
    [ApiController]
    public class ChatsController : ControllerBase
    {
        private WebApiService _service;
        private IConfiguration _configuration;
        

        public ChatsController(ChatServerContext context, IConfiguration configuration, IHubContext<ChatHub> chatHub)
        {
            _configuration = configuration;
            _service = new WebApiService(context, chatHub);
        }

        public class contactInfo
        {
            public String id { get; set; }
            public String name { get; set; }
            public String server { get; set; }
            public String last { get; set; }
            public String lastdate { get; set; }
        }
        

        public class contactMessages
        {
            public int id { get; set; }
            public string content { get; set; }
            public string created { get; set; }
            public string sent { get; set; }
            public string type { get; set; }
        }
        public class invitationObj
        {
            public string from { get; set; }
            public string to { get; set; }
            public string server { get; set; }
        }
        public class transferObj
        {
            public string from { get; set; }
            public string to { get; set; }
            public string content { get; set; }
        }

        public class userLogin
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }



        [HttpGet("/api/contacts")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<contactInfo>>> GetContacts()
        {
            string currentUserName = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            return await _service.GetContacts(currentUserName);

        }

        [HttpPost("/api/contacts")]
        [Authorize]
        public async Task setContacts([Bind("id,name,server")] contactInfo newContactInfo)
        {
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            var isChatExist = await _service.getChat(currentUser, newContactInfo.id);
            if (isChatExist != null)
            {
                Response.StatusCode = 409;
                return;
            }
             await _service.setContacts(newContactInfo.server,newContactInfo.id, newContactInfo.name, currentUser);
            Response.StatusCode = 201;
        }

        [HttpPut("/api/contacts/{userName}")]
        [Authorize]
        public async Task<ActionResult<contactInfo>> UpdateContacts([Bind("name,server")] contactInfo newContact, string userName)
        {
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            Chat newChat = await _service.getChat(currentUser, userName);
            if (newChat == null)
            {
                return NotFound();
            }
            newChat.Contact.DisplayName = newContact.name;
            newChat.Contact.Server = newContact.server;
            await _service.updateContactWithChat(newChat);
            return StatusCode(204);
        }


        

        [HttpDelete("/api/contacts/{userName}")]
        [Authorize]
        public async Task DeleteContacts(string userName)
        {
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            Chat getChat = await _service.getChat(currentUser, userName);
            if (getChat == null)
            {
                Response.StatusCode = 404;
                return;
            }
            await _service.DeleteContacts(getChat);
            Response.StatusCode = 204;
        }

        [HttpGet("/api/contacts/{userName}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<contactInfo>>> GetChat(string userName)
        {
            string currentUserName = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            List<contactInfo> list = await _service.getContactInfo(currentUserName, userName);
            if (list.Count == 0)
            {
                return NotFound();
            }
            return list;
        }

        [HttpGet("/api/contacts/{userName}/messages")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<contactMessages>>> GetMessages(string userName)
        {   
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            return await _service.GetMessages(userName, currentUser);
        }

        [HttpPost("/api/contacts/{userName}/messages")]
        [Authorize]
        public async Task SendMessages([Bind("content")] contactMessages contactMessage, string userName)
        {
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            Chat chat = await _service.getChat(currentUser, userName);
            if (chat == null)
            {
                Response.StatusCode = 404;
                return;
            }
            await _service.SendMessages(contactMessage, chat, true);
            Response.StatusCode = 201;
        }

        [HttpGet("/api/contacts/{userName}/messages/{messageId}")]
        [Authorize]
        public async Task<List<contactMessages>> GetMessagesWithId(string userName, int messageId)
        {
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            return await _service.GetContactMessagesWithId(userName, messageId, currentUser);
        }

        [HttpPut("/api/contacts/{userName}/messages/{id}")]
        [Authorize]
        public async Task putMessagesWithId([Bind("content")] contactMessages contactMessage, string userName, int id)
        {
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            var message = await _service.GetMessagesWithId(userName, id, currentUser);
            if (message == null)
            {
                Response.StatusCode = 404;
                return;
            }
            await _service.putMessagesWithId(contactMessage, message);
            Response.StatusCode = 204;
        }

        [HttpDelete("/api/contacts/{userName}/messages/{id}")]
        [Authorize]
        public async Task deleteMessagesWithId(string userName, int id)
        {  
            string currentUser = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            var message = await _service.GetMessagesWithId(userName, id, currentUser);
            if (message == null)
            {
                Response.StatusCode = 404;
                return;
            }
            await _service.deleteMessagesWithId(userName, id, currentUser, message);
            Response.StatusCode = 204;
        }

        [HttpPost("/api/invitations")]
        public async Task invitation([Bind("from", "to", "server")] invitationObj invite)
        {
            string currentUser = invite.to;
            var fromName = invite.from;
            var isChatExist = await _service.getChat(currentUser, fromName);
            if (isChatExist != null)
            {
                Response.StatusCode = 409;
                return;
            }
            var getCurrentUser = await _service.getUserFromDb(currentUser);
            if (getCurrentUser == null)
            {
                Response.StatusCode = 404;
                return;
            }
            await _service.setContacts(invite.server, fromName, fromName, currentUser);
            await _service._Hub.Clients.All.SendAsync("AddContact" + invite.to, new contactInfo { id = fromName, name = fromName, server = invite.server, last = null, lastdate = null });
            Response.StatusCode = 201;

        }

        [HttpPost("/api/transfer")]
        public async Task transfer([Bind("from", "to", "content")] transferObj transferData)
        {
            string currentUser = transferData.to;
            var fromName = transferData.from;
            var chat = await _service.getChat(currentUser, fromName);
            if (chat == null)
            {
                Response.StatusCode = 404;
                return;
            }
            await _service.transfer(transferData, chat);
            Response.StatusCode = 201;

        }

        [HttpPost("/api/login")]
        public async Task<ActionResult<User>> Login([Bind("Username", "Password")] userLogin user)
        {
            // FIX CASE INSENSITIVE

            var User = await _service.getUserFromDb(user.Username);
            if (User == null || User.Password != user.Password)
            {
                return Unauthorized();
            }
            else
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _configuration["JWTParams:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                    new Claim("UserId", user.Username)
                };
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTParams:SecretKey"]));
                var mac = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _configuration["JWTParams:Issuer"],
                    _configuration["JWTParams:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: mac);
                return Ok(new JwtSecurityTokenHandler().WriteToken(token));
            }
        }

        [HttpPost("/api/register")]
        public async Task<ActionResult<User>> Register([Bind("Username", "Password", "Displayname", "Server", "Image")] User user)
        {
            var User = await _service.getUserFromDb(user.Username);
            if (User != null)
            {
                return StatusCode(409, new{ message = "User already exists!" });
            }
            else
            {
                await _service.saveUser(user);
                var claims = new[]
               {
                    new Claim(JwtRegisteredClaimNames.Sub, _configuration["JWTParams:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                    new Claim("UserId", user.Username)
                };
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTParams:SecretKey"]));
                var mac = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _configuration["JWTParams:Issuer"],
                    _configuration["JWTParams:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: mac);
                return StatusCode(201,new JwtSecurityTokenHandler().WriteToken(token));
            }
        }

        [HttpGet("/api/user/{UserName}")]
        public async Task<ActionResult<User>> getUserDetails(string userName)
        {
            var user = await _service.getUserFromDb(userName);
            if(user == null)
            {
                return StatusCode(404, new { message = "User is not exist" });
            } else
            {
                return Ok(new {UserName = user.Username, DisplayName = user.Displayname ,Image = user.Image});
            }
        }

        [HttpGet("/api/contacts/lastMessage/{UserName}")]
        [Authorize]
        public async Task<ActionResult<contactMessages>> getLastMessage(string userName)
        {
            var currentUserName = _service.extractNameJWT(await HttpContext.GetTokenAsync("access_token"));
            contactMessages lastMessage = await _service.getLastMessage(userName, currentUserName);
            if (lastMessage == null)
            {
                return NotFound();
            }
            return lastMessage;
        }

    }
}

