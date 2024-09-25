using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("controller")]
    public class PlatformsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public PlatformsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("api/platform")]
        public ActionResult<Platform> GetPlatform() {
        
            var platform = _dbContext.Set<Platform>().ToList();
            return Ok(platform);
        }
    }
}
