using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Problemset_Collection_Server.Data;
using Problemset_Collection_Server.DTO;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemsController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public ProblemsController(AppDbContext _dbContext) {
            dbContext = _dbContext;
        }

        //[HttpGet]
        //public ActionResult<Problem> GetProblems() {
        //    var problems = dbContext.Problems.ToList();
        //    return Ok(problems);
        //}

        [HttpGet]
        public ActionResult<IEnumerable<Problem>> GetProblems(int page = 1, int pageSize = 10) {
            // Calculate how many items to skip based on the page and pageSize
            var problems = dbContext.Problems
                                    .Skip((page - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToList();

            // Return the paginated list of problems
            return Ok(problems);
        }



        [HttpGet]
        [Route("{id:int}")]
        public ActionResult<Problem> GetProblemById(int id) {
            var problems = dbContext.Problems.Find(id);
            return problems == null ? NotFound() : Ok(problems);
        }
        [HttpGet("difficulties")]
        public ActionResult<string> GetDifficulties() {

            var difficulties = dbContext.Problems.Select(p => p.ProblemDifficulty).Distinct().OrderBy(d => d).ToList();

            if (difficulties == null) return NotFound("No difficulties found.");

            return Ok(difficulties);
        }

        [HttpPost]
        public async Task<ActionResult<Problem>> CreateProblem(ProblemCreationDto problemDto) {
            if (problemDto == null) return BadRequest("Problem data is required.");

            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try {
                var platform = await dbContext.Platforms.FirstOrDefaultAsync(pl => pl.PlatformName == problemDto.PlatformName);
                if (platform == null) {
                    platform = new Platform { PlatformName = problemDto.PlatformName };
                    dbContext.Platforms.Add(platform);
                    await dbContext.SaveChangesAsync();
                }

                int platformId = platform.PlatformId;

                var problem = new Problem {
                    ProblemName = problemDto.ProblemName,
                    ProblemDifficulty = problemDto.ProblemDifficulty,
                    ProblemUrl = problemDto.ProblemUrl,
                    PlatformId = platformId
                };

                dbContext.Problems.Add(problem);
                await dbContext.SaveChangesAsync();

                foreach (var tagName in problemDto.Tags) {
                    var tag = await dbContext.Tags.FirstOrDefaultAsync(t => t.TagName.ToLower() == tagName.ToLower());

                    int tagId;
                    if (tag == null) {
                        tag = new Tag { TagName = tagName.ToLower().ToTitle() };
                        dbContext.Tags.Add(tag);
                        await dbContext.SaveChangesAsync();
                        tagId = tag.TagId;
                    }
                    else {
                        tagId = tag.TagId;
                    }

                    var problemTag = new ProblemTag {
                        ProblemId = problem.ProblemId,
                        TagId = tagId,
                    };
                    dbContext.ProblemTags.Add(problemTag);
                    await dbContext.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetProblemById), new { id = problem.ProblemId }, problem);
            }
            catch {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while creating the problem.");
            }
        }


        [HttpPut("{problemId:int}")]
        public ActionResult<Problem> UpdateProblem(int problemId, Problem problem) {
            if (problemId <= 0) return BadRequest("Id must be a positive integer.");

            var existingProblem = dbContext.Problems.Find(problemId);
            if (existingProblem == null) return NotFound($"Problem with Id {problemId} not found.");

            existingProblem.PlatformId = problem.PlatformId;
            existingProblem.ProblemName = problem.ProblemName;
            existingProblem.ProblemDifficulty = problem.ProblemDifficulty;
            existingProblem.ProblemUrl = problem.ProblemUrl;
            dbContext.SaveChanges();

            return Ok(existingProblem);
        }

        [HttpDelete("{problemId:int}")]
        public ActionResult<Problem> DeleteProblem(int problemId) {
            if (problemId <= 0) return BadRequest("Id must be a positive integer.");

            var existingProblem = dbContext.Problems.Find(problemId);
            if (existingProblem == null) return NotFound($"Problem with Id {problemId} not found.");

            dbContext.Problems.Remove(existingProblem);
            dbContext.SaveChanges();
            return NoContent();
        }

    }
}
