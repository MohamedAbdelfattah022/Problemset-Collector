using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlatformsController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public PlatformsController(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        public ActionResult<Platform> GetPlatform() {
        
            var platform = dbContext.Platforms.ToList();
            return Ok(platform);
        }
    }
}
