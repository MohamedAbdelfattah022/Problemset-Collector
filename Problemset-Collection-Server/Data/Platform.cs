using System.ComponentModel.DataAnnotations;

namespace Problemset_Collection_Server.Data
{
    public class Platform
    {
        public int PlatformId { get; set; }
        [Required]
        public string PlatformName { get; set; }
        [Required]
        public string PlatformUrl { get; set; }
    }
}
