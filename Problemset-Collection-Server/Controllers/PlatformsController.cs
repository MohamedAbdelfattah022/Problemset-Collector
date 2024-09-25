using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlatformsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public PlatformsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<Platform> GetPlatform() {
        
            var platform = _dbContext.Set<Platform>().ToList();
            return Ok(platform);
        }
    }
}
