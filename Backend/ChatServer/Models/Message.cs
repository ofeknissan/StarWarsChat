using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatServer.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        public bool sent { get; set; }

        public string Time { get; set; }

        public string Type { get; set; }

        public long Timeinseconds { get; set; }

        public string Content { get; set; }

        public int ChatId { get; set; }
    }
}
