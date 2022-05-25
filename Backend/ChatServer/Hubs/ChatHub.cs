using System.Threading.Tasks;
using ChatServer.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(Message message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
