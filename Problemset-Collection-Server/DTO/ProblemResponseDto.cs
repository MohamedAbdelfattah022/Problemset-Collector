namespace Problemset_Collection_Server.DTO
{
    public class ProblemResponseDto
    {
        public int ProblemId { get; set; }
        public string ProblemName { get; set; }
        public string PlatformName { get; set; }
        public string ProblemDifficulty { get; set; }
        public string ProblemUrl { get; set; }
        public List<string> Tags { get; set; }
    }

}
