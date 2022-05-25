using System.ComponentModel.DataAnnotations;


namespace ChatServer.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }

        public string Username { get; set; }

        public string DisplayName { get; set; }

        public string Server { get; set; }

    }
}
