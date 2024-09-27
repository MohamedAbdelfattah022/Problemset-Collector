using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

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

        [HttpGet]
        public ActionResult<Problem> GetProblems() {
            var problems = dbContext.Problems.ToList();
            return Ok(problems);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<Problem> GetProblemById(int id) {
            var problems = dbContext.Problems.Find(id);
            return problems == null ? NotFound() : Ok(problems);
        }


    }
}
