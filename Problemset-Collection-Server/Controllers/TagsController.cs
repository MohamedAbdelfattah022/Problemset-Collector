using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public TagsController(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        public ActionResult<Tag> GetTags()
        {
            var tags = dbContext.Tags.ToList();
            return Ok(tags);
        }
    }
}
