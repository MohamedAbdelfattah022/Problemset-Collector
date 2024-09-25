using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ProblemsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<Problem> GetProblems()
        {
            var problems = _dbContext.Set<Problem>().ToList();
            return Ok(problems);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<Problem> GetProblemById(int id)   
        {
            var problems = _dbContext.Set<Problem>().Find(id);
            return problems == null? NotFound() : Ok(problems);
        }


    }
}
