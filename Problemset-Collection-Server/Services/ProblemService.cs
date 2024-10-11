using Microsoft.EntityFrameworkCore;
using Problemset_Collection_Server.Data;
using Problemset_Collection_Server.DTO;

namespace Problemset_Collection_Server.Services
{
    public class ProblemService
    {
        private readonly AppDbContext dbContext;

        public ProblemService(AppDbContext dbContext) {
            this.dbContext = dbContext;
        }

        public async Task<ProblemDataDto> GetProblemByIdAsync(int problemId) {
            var problem = await dbContext.Problems.FindAsync(problemId);
            if (problem == null)
                return null;

            int platformId = problem.PlatformId;
            var platform = await dbContext.Platforms.FindAsync(platformId);
            if (platform == null)
                return null;

            var problemTags = await dbContext.ProblemTags
                                             .Where(pt => pt.ProblemId == problemId)
                                             .ToListAsync();
            List<int> tagIds = problemTags.Select(pt => pt.TagId).ToList();

            List<string> tags = new List<string>();
            foreach (var tagId in tagIds) {
                var tag = await dbContext.Tags.FindAsync(tagId);
                if (tag != null) {
                    tags.Add(tag.TagName);
                }
            }

            return new ProblemDataDto {
                ProblemName = problem.ProblemName,
                PlatformName = platform.PlatformName,
                ProblemDifficulty = problem.ProblemDifficulty,
                ProblemUrl = problem.ProblemUrl,
                Tags = tags,
            };
        }
    }
}
