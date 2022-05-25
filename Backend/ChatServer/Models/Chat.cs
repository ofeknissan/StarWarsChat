using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatServer.Models
{
    public class Chat
    {
        [Key]
        public int Id { get; set; }

        public User User { get; set; }

        public Contact Contact{ get; set; }

        public int? MessageId { get; set; }
    }
}
