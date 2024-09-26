using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlatformsController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        public PlatformsController(AppDbContext _dbContext) { dbContext = _dbContext; }

        [HttpGet]
        public ActionResult<Platform> GetPlatform() {
            var platforms = dbContext.Platforms.ToList();
            if (platforms == null) return NotFound("No platforms found.");

            return Ok(platforms);
        }

        [HttpGet("{id:int}")]
        public ActionResult<Platform> GetById(int id) {
            if (id <= 0) return BadRequest("ID must be a positive integer.");

            var platform = dbContext.Platforms.Find(id);
            if (platform == null) return NotFound($"Platform with ID {id} not found.");

            return Ok(platform);
        }

        [HttpGet("{platformName:alpha}")]
        public ActionResult<Platform> GetByName(string platformName) {
            var platform = dbContext.Platforms.FirstOrDefault(p => p.PlatformName.ToLower() == platformName.ToLower());
            if (platform == null) return NotFound($"Platform with name '{platformName}' not found.");
            return Ok(platform);
        }

        [HttpPost]
        public ActionResult<Platform> AddPlatform(Platform platform) {
            string platformName = platform.PlatformName.ToLower();
            string platformUrl = platform.PlatformUrl;

            var validUrl = RegularExpressions.urlRegex.IsMatch(platformUrl);
            if (!validUrl) return BadRequest("Url is not valid");

            var existingPlatform = dbContext.Platforms
                .FirstOrDefault(p => p.PlatformName.ToLower() == platformName || p.PlatformUrl == platformUrl);

            if (existingPlatform != null) return Conflict("Platform already exists.");

            dbContext.Platforms.Add(platform);
            dbContext.SaveChanges();
            return CreatedAtAction("GetById", new { id = platform.PlatformId }, platform);
        }

        [HttpPut("{id:int}")]
        public ActionResult<Platform> UpdatePlatform(int id, Platform platform) {
            if (id <= 0) return BadRequest("ID must be a positive integer.");

            var existingPlatform = dbContext.Platforms.Find(id);
            if (existingPlatform == null) return NotFound($"Platform with ID {id} not found.");

            var validUrl = RegularExpressions.urlRegex.IsMatch(platform.PlatformUrl);
            if (!validUrl) return BadRequest("Url is not valid");

            existingPlatform.PlatformName = platform.PlatformName;
            existingPlatform.PlatformUrl = platform.PlatformUrl;
            dbContext.SaveChanges();
            return CreatedAtAction("GetById", new { id = platform.PlatformId }, existingPlatform);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<Platform> DeletePlatform(int id) {
            if (id <= 0) return BadRequest("ID must be a positive integer.");

            var existingPlatform = dbContext.Platforms.Find(id);
            if (existingPlatform == null) return NotFound($"Platform with ID {id} not found.");

            dbContext.Platforms.Remove(existingPlatform);
            dbContext.SaveChanges();
            return NoContent();
        }
    }
}