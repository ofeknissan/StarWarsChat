using System.ComponentModel.DataAnnotations;


namespace ChatServer.Models

{
    public class Rating
    {
        [Key]
        public int Id { get; set; }
        [Display(Name = "Name")]
        [Required(ErrorMessage = "This field is required!")]
        public string Name { get; set; }

        [Display(Name = "Rating")]
        [Required(ErrorMessage = "This field is required!")]
        [Range(1,5)]
        public int Score { get; set; }

        [Display(Name = "Description")]
        [Required(ErrorMessage = "This field is required!")]
        public string Text { get; set; }

        [Display(Name = "Date")]
        public string Date { get; set; }
    }
}
