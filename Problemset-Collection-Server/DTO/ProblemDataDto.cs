namespace Problemset_Collection_Server.DTO
{
    public class ProblemDataDto
    {
        public string ProblemName { get; set; }
        public string PlatformName { get; set; }
        public string ProblemUrl { get; set; }
        public string ProblemDifficulty { get; set; }
        public List<string> Tags { get; set; }
    }
}
