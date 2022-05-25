using ChatServer.Data;
using ChatServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
using static ChatServer.Controllers.ChatsController;

namespace ChatServer.Services
{

    public class WebApiService
    {
        private readonly ChatServerContext _context;
        public IHubContext<ChatHub> _Hub;
        public WebApiService(ChatServerContext context,IHubContext<ChatHub> chatHub)
        {
            _context = context;
            _Hub = chatHub;

        }

        public string extractNameJWT(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            return jwt.Claims.First(claim => claim.Type == "UserId").Value;

        }

        public async Task<ActionResult<IEnumerable<contactInfo>>> GetContacts(string currentUserName)
        {

            var leftOuterJoinQuery =
                from Chat in _context.Chat
                join Message in _context.Message on Chat.MessageId equals Message.Id into ChatMsg
                from Item in ChatMsg.DefaultIfEmpty()
                where Chat.User.Username == currentUserName
                select new contactInfo { id = Chat.Contact.Username, name = Chat.Contact.DisplayName, server = Chat.Contact.Server, last = Item.Content, lastdate = Item.Time };
            return await leftOuterJoinQuery.ToListAsync();
        }

        public async Task<User> getUserFromDb(string currentUser) {
            var getCurrentUser = from User in _context.User
                                 where User.Username == currentUser
                                 select User;
            return await getCurrentUser.FirstOrDefaultAsync();
        }
 
        public async Task<Chat> getChat(string currentUser, string contact)
        {
            var getCurrentChat = await _context.Chat.Include(x => x.User).Include(y => y.Contact).FirstOrDefaultAsync(Chat =>
                (Chat.User.Username == currentUser && Chat.Contact.Username == contact)
                );
            return getCurrentChat;
        }

        public async Task<int> getMaxIdContact()
        {
            var maxId = from Contact in _context.Contact
                        select Contact;
            if (!maxId.Any())
            {
                return 1;
            }
            else
            {
               return maxId.Max(u => u.Id) + 1;
            }
        }

        public async Task<int> getMaxIdChat()
        {
            if (!_context.Chat.Any())
            {
                return 1;
            }
            else
            {
                return _context.Chat.Max(u => u.Id) + 1;
            }
        }

        public async Task<int> getMaxIdMessage()
        {
            if (!_context.Message.Any())
            {
                return 1;
            }
            else
            {
                return _context.Message.Max(u => u.Id) + 1;
            }
        }

        public async Task updateContactWithChat(Chat updatedChat)
        {
            _context.Update(updatedChat);
            _context.SaveChangesAsync();
        }
      
        public async Task setContacts(string server, string id, string name, string currentUser)
        {
            User userFromDb = await getUserFromDb(currentUser);
            Contact newContact = new Contact();
            newContact.Server = server;
            newContact.Username = id;
            newContact.DisplayName = name;
            newContact.Id = await getMaxIdContact();

            Chat newChat = new Chat();
            newChat.User = userFromDb;
            newChat.Contact = newContact;
            newChat.Id = await getMaxIdChat();
            await _context.Chat.AddAsync(newChat);
            await _context.SaveChangesAsync();
        }
   
        public async Task DeleteContacts(Chat chatToDel)
        {
            var messages = _context.Message.Where(w => w.ChatId == chatToDel.Id);
            foreach (Message message in messages)
            {
                _context.Entry(message).State = EntityState.Deleted;
            }
            Contact contactToDelete = chatToDel.Contact;
            _context.Entry(contactToDelete).State = EntityState.Deleted;
            _context.Entry(chatToDel).State = EntityState.Deleted;
            _context.SaveChanges();
        }

        public async Task<List<contactInfo>> getContactInfo(string currentUserName, string userName)
        {
            //currentUserName is in column 1
            var leftOuterJoinQuery =
                from Chat in _context.Chat
                join Message in _context.Message on Chat.MessageId equals Message.Id into ChatMsg
                from Item in ChatMsg.DefaultIfEmpty()
                where Chat.User.Username == currentUserName && Chat.Contact.Username == userName
                select new contactInfo { id = Chat.Contact.Username, name = Chat.Contact.DisplayName, server = Chat.Contact.Server, last = Item.Content, lastdate = Item.Time };
            var list = await leftOuterJoinQuery.ToListAsync();
            return list;
        }

        public async Task<ActionResult<IEnumerable<contactMessages>>> GetMessages(string userName, string currentUser)
        {
            var messages = from Chat in _context.Chat
                           join Message in _context.Message on Chat.Id equals Message.ChatId
                           where (Chat.User.Username == currentUser && Chat.Contact.Username == userName)
                           select new contactMessages { id = Message.Id, content = Message.Content, created = Message.Time, sent = Message.sent.ToString(), type = Message.Type };
            return await (messages).ToListAsync();
        }

        public async Task<Message> SendMessages( contactMessages contactMessage, Chat currentChat, bool sent)
        {
            Message message = new Message();
            message.Id = await getMaxIdMessage();
            message.sent = sent;
            message.Content = contactMessage.content;
            TimeSpan t = (DateTime.UtcNow - new DateTime(1970, 1, 1));
            message.Time = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.") + (int)t.TotalSeconds;
            message.Timeinseconds = (long)t.TotalSeconds;
            message.Type = "Text";
            currentChat.MessageId = message.Id;
            message.ChatId = currentChat.Id;
            _context.Add(message);
            _context.Update(currentChat);
            await _context.SaveChangesAsync();
            return message;
        }


        public async Task<List<contactMessages>> GetContactMessagesWithId(string userName, int messageId, string currentUser)
        {
            var messages = from Chat in _context.Chat
                           join Message in _context.Message on Chat.Id equals Message.ChatId
                           where (Chat.User.Username == currentUser && Chat.Contact.Username == userName) && (Message.Id == messageId)
                           select new contactMessages { id = Message.Id, content = Message.Content, created = Message.Time, sent = Message.sent.ToString(), type = Message.Type };
            return await messages.ToListAsync();
        }

        public async Task<Message> GetMessagesWithId(string userName, int messageId, string currentUser)
        {
            var messages = from Chat in _context.Chat
                           join Message in _context.Message on Chat.Id equals Message.ChatId
                           where (Chat.User.Username == currentUser && Chat.Contact.Username == userName) && (Message.Id == messageId)
                           select Message;
            return await messages.FirstOrDefaultAsync();
        }

        
        public async Task putMessagesWithId( contactMessages contactMessage, Message message)
        {            
            
            message.Content = contactMessage.content;
            /*TimeSpan t = (DateTime.UtcNow - new DateTime(1970, 1, 1));
            message.Time = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.") + (int)t.TotalSeconds;
            message.Timeinseconds = (long)t.TotalSeconds;
            message.Type = "Text";*/
            _context.Update(message);
            await _context.SaveChangesAsync();
        }

        public async Task deleteMessagesWithId(string userName, int id, string currentUser, Message messageToDelete)
        {   var currentChat = await getChat(currentUser, userName);

            //update new last message sent
            if (currentChat.MessageId == id)
            {
                var messages = from Chat in _context.Chat
                               join Message in _context.Message on Chat.Id equals Message.ChatId
                               where (Chat.User.Username == currentUser && Chat.Contact.Username == userName) && Message.Id != id
                               select Message;
                if (!messages.Any())
                {
                    currentChat.MessageId = null;

                }
                else
                {
                    var newLastMsgId = messages.Max(u => u.Id) + 1;
                    currentChat.MessageId = newLastMsgId;
                }
                _context.Update(currentChat);
            }
            _context.Entry(messageToDelete).State = EntityState.Deleted;
            _context.SaveChanges();
        }

      

        [HttpPost("/api/transfer")]
        public async Task transfer(transferObj transferData, Chat chat)
        {
            contactMessages newMessage = new contactMessages();
            newMessage.content = transferData.content;
            Message message = await SendMessages(newMessage, chat, false);
            await _Hub.Clients.All.SendAsync("ReceiveMessage" + transferData.to, new { message = new contactMessages { id = message.Id, content = message.Content, created = message.Time, type = message.Type, sent = false.ToString() }, contactName = transferData.from });

        }

        public async Task saveUser(User user)
        {
            _context.Add(user);
            await _context.SaveChangesAsync();
        }


        public async Task<contactMessages> getLastMessage(string userName, string currentUserName)
        {
            var message = from chat in _context.Chat
                          join Message in _context.Message on chat.Id equals Message.ChatId
                          where chat.User.Username == currentUserName && chat.Contact.Username == userName
                          select Message;
            if (!message.Any())
            {
                return null;
            }
            else
            {
                int maxId = message.Max(i => i.Id);
                var item = message.First(x => x.Id == maxId);
                return new contactMessages { id = item.Id, content = item.Content, created = item.Time, type = item.Type, sent = item.sent.ToString() };
            }
        }

    }
}

