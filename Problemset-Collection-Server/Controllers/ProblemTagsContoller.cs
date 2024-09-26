using Azure;
using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemTagsController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public ProblemTagsController(AppDbContext _dbContext) { dbContext = _dbContext; }

        [HttpGet("")]
        public ActionResult<ProblemTag> GetAllProblemTags()
        {
            var problemTags = dbContext.ProblemTags.ToList();

            if (!problemTags.Any()) return NotFound();

            return Ok(problemTags);
        }

        [HttpGet("tag/{problemId:int}")]
        public ActionResult<ProblemTag> GetProblemTags(int problemId)
        {
            var problemTags = dbContext.ProblemTags.Where(p => p.ProblemId == problemId).ToList();

            if (!problemTags.Any()) return NotFound();

            return Ok(problemTags);
        }

        [HttpGet("problems/{tagId:int}")]
        public ActionResult<ProblemTag> GetProblemsHaveTagId(int tagId)
        {
            var problems = dbContext.ProblemTags.Where(p => p.TagId == tagId).ToList();

            if (!problems.Any()) return NotFound();

            return Ok(problems);
        }

        [HttpPost]
        public ActionResult<ProblemTag> CreateProblemTag(ProblemTag problemTag)
        {
            if (problemTag == null) return BadRequest();
            if (dbContext.ProblemTags.Any(pt => pt == problemTag))
                return Conflict($"'{new { TagId = problemTag.TagId, ProblemId = problemTag.ProblemId }}' already exists.");

            dbContext.ProblemTags.Add(problemTag);
            dbContext.SaveChanges();
            return CreatedAtAction("GetProblemTags", new { problemId = problemTag.ProblemId }, problemTag);
        }

        [HttpDelete("{tagId:int}/{problemId:int}")]
        public ActionResult<ProblemTag> DeleteProblemTag(int tagId, int problemId)
        {
            if (tagId <= 0 || problemId <= 0) return BadRequest("Both Ids has to be Positive");

            var problemTag = dbContext.ProblemTags.FirstOrDefault(p => p.ProblemId == problemId && p.TagId == tagId);
            if (problemTag  == null) return NotFound();

            dbContext.ProblemTags.Remove(problemTag );
            dbContext.SaveChanges();
            return NoContent();
        }
    }
}
