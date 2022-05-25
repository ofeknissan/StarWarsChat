using System.ComponentModel.DataAnnotations;

namespace ChatServer.Models
{
    public class User
    {
        [Key]
        [Display(Name = "Username")]
        public string Username { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Displayname")]
        public string Displayname { get; set; }

        public string Server { get; set; }

        public string? Image { get; set; }
    }
}
