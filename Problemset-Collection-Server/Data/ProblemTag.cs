using System.ComponentModel.DataAnnotations;

namespace Problemset_Collection_Server.Data
{
    public class ProblemTag
    {
        [Key]
        public int TagId {  get; set; }
        public int ProblemId {  get; set; }
    }
}
