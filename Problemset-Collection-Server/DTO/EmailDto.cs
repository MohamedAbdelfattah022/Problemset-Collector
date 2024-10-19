using System.ComponentModel.DataAnnotations;

namespace Problemset_Collection_Server.DTO
{
    public class EmailDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Invalid Email")]
        public string Email { get; set; }
    }
}
