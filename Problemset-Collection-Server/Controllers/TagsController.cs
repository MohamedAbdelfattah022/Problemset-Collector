using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("controller")]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public TagsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("api/tags")]
        public ActionResult<Tag> GetTags()
        {
            var tags = _dbContext.Set<Tag>().ToList();
            return Ok(tags);
        }
    }
}
