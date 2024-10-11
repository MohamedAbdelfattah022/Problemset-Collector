using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Problemset_Collection_Server.Data;
using Problemset_Collection_Server.DTO;
using Problemset_Collection_Server.Services;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemsController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly ProblemService problemService;
        public ProblemsController(AppDbContext _dbContext, ProblemService problemService) {
            dbContext = _dbContext;
            this.problemService = problemService;
        }

        [HttpGet]
        public async Task<ActionResult<ProblemResponseDto>> GetProblems(int page = 1, int pageSize = 10) {
            if (page < 1) return BadRequest("Page number must be greater than or equal to 1");

            if (pageSize < 1) return BadRequest("Page size must be <= 1 ");

            var problems = await dbContext.Problems
                                          .Skip((page - 1) * pageSize)
                                          .Take(pageSize)
                                          .ToListAsync();

            if (problems.Count == 0) return Ok(new List<ProblemResponseDto>());

            var problemResponseDtos = new List<ProblemResponseDto>();

            foreach (var problem in problems) {
                var problemDataDto = await problemService.GetProblemByIdAsync(problem.ProblemId);

                var problemResponse = new ProblemResponseDto {
                    ProblemId = problem.ProblemId,
                    ProblemName = problemDataDto.ProblemName,
                    PlatformName = problemDataDto.PlatformName,
                    ProblemDifficulty = problemDataDto.ProblemDifficulty,
                    ProblemUrl = problemDataDto.ProblemUrl,
                    Tags = problemDataDto.Tags
                };

                problemResponseDtos.Add(problemResponse);
            }

            return Ok(problemResponseDtos);
        }


        [HttpGet("{problemId:int}")]
        public async Task<ActionResult<ProblemDataDto>> GetProblemById(int problemId) {
            var problemData = await problemService.GetProblemByIdAsync(problemId);
            return problemData == null ? NotFound() : Ok(problemData);
        }


        [HttpGet("difficulties")]
        public ActionResult<string> GetDifficulties() {

            var difficulties = dbContext.Problems.Select(p => p.ProblemDifficulty).Distinct().OrderBy(d => d).ToList();

            if (difficulties == null) return NotFound("No difficulties found.");

            return Ok(difficulties);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Problem>> CreateProblem(ProblemDataDto problemDto) {
            if (problemDto == null) return BadRequest("Problem data is required.");
            if (!RegularExpressions.urlRegex.IsMatch(problemDto.ProblemUrl)) return BadRequest("Problem URL is not valid");

            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try {
                var platform = await dbContext.Platforms.FirstOrDefaultAsync(pl => pl.PlatformName == problemDto.PlatformName);
                if (platform == null) return BadRequest("Platform not exists");

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

                return CreatedAtAction(nameof(GetProblemById), new { problemId = problem.ProblemId }, problemDto);
            }
            catch (Exception ex) {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred while updating the problem.\n Error Details:\n{ex}");
            }
        }


        [HttpPut("{problemId:int}")]
        [Authorize]
        public async Task<ActionResult<Problem>> UpdateProblem(int problemId, ProblemDataDto problemDto) {
            if (problemId <= 0) return BadRequest("Id must be a positive integer.");
            if (problemDto == null) return BadRequest("Problem data is required.");
            if (!RegularExpressions.urlRegex.IsMatch(problemDto.ProblemUrl)) return BadRequest("Problem URL is not valid");

            using var transaction = await dbContext.Database.BeginTransactionAsync();
            try {
                var existingProblem = await dbContext.Problems.FindAsync(problemId);
                if (existingProblem == null) return NotFound($"Problem with Id {problemId} not found.");

                var platform = await dbContext.Platforms.FirstOrDefaultAsync(pl => pl.PlatformName == problemDto.PlatformName);
                if (platform == null) return BadRequest("Platform not exists");

                int platformId = platform.PlatformId;

                existingProblem.ProblemName = problemDto.ProblemName;
                existingProblem.ProblemDifficulty = problemDto.ProblemDifficulty;
                existingProblem.ProblemUrl = problemDto.ProblemUrl;
                existingProblem.PlatformId = platformId;

                dbContext.Problems.Update(existingProblem);
                await dbContext.SaveChangesAsync();

                var existingProblemTags = await dbContext.ProblemTags
                    .Where(pt => pt.ProblemId == problemId)
                    .ToListAsync();

                var existingTagIds = existingProblemTags.Select(pt => pt.TagId).ToList();
                var incomingTags = problemDto.Tags.Select(t => t.ToLower()).ToList();

                foreach (var existingProblemTag in existingProblemTags) {
                    var tag = await dbContext.Tags.FindAsync(existingProblemTag.TagId);
                    if (tag != null && !incomingTags.Contains(tag.TagName.ToLower())) {
                        dbContext.ProblemTags.Remove(existingProblemTag);
                        await dbContext.SaveChangesAsync();
                    }
                }

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

                    if (!existingTagIds.Contains(tagId)) {
                        var problemTag = new ProblemTag {
                            ProblemId = problemId,
                            TagId = tagId
                        };
                        dbContext.ProblemTags.Add(problemTag);
                        await dbContext.SaveChangesAsync();
                    }
                }

                await transaction.CommitAsync();

                return Ok(problemDto);
            }
            catch (Exception ex) {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred while updating the problem.\n Error Details:\n{ex}");
            }
        }


        [HttpDelete("{problemId:int}")]
        [Authorize]
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
