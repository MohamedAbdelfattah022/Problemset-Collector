using Microsoft.AspNetCore.Mvc;
using Problemset_Collection_Server.Data;
using System.ComponentModel.DataAnnotations;

namespace Problemset_Collection_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public TagsController(AppDbContext _dbContext) { dbContext = _dbContext; }

        [HttpGet]
        public ActionResult<Tag> GetTags() {
            try {
                var tags = dbContext.Tags.ToList();

                if (tags == null || !tags.Any()) return NotFound("No tags found.");

                return Ok(tags);
            }
            catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id:int}")]
        public ActionResult<Tag> GetById(int id) {
            if (id <= 0) return BadRequest("Id must be a positive integer.");

            Tag tag = dbContext.Tags.FirstOrDefault(t => t.TagId == id);

            if (tag == null) return NotFound($"Tag with Id {id} not found.");

            return Ok(tag);
        }

        [HttpPost("{tagName}")]
        public ActionResult<Tag> AddTag([FromRoute, Required] string tagName) {
            if (string.IsNullOrWhiteSpace(tagName))
                return BadRequest("Tag name cannot be empty or whitespace.");

            Tag tag = new Tag();
            tag.TagName = tagName.ToTitle();

            if (dbContext.Tags.Any(t => t.TagName == tag.TagName))
                return Conflict($"Tag '{tag.TagName}' already exists.");

            dbContext.Tags.Add(tag);
            dbContext.SaveChanges();

            return CreatedAtAction("GetById", new { id = tag.TagId }, tag);
        }

        [HttpPut("{id:int}")]
        public ActionResult<Tag> UpdateTag(int id, [FromBody] Tag tag) {
            if (id <= 0) return BadRequest("Id must be a positive integer.");

            if (tag == null || string.IsNullOrWhiteSpace(tag.TagName))
                return BadRequest("Tag data is invalid. Ensure tag name is provided.");

            try {
                Tag currentTag = dbContext.Tags.FirstOrDefault(t => t.TagId == id);

                if (currentTag == null) return NotFound($"Tag with Id {id} not found.");

                currentTag.TagName = tag.TagName.ToTitle();
                dbContext.SaveChanges();

                return Ok(currentTag);
            }
            catch (Exception ex) {
                return StatusCode(500, ex);
            }
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeleteTag(int id) {
            if (id <= 0) return BadRequest("Id must be a positive integer.");

            try {
                Tag tag = dbContext.Tags.FirstOrDefault(t => t.TagId == id);

                if (tag == null) return NotFound($"Tag with Id {id} not found.");

                dbContext.Tags.Remove(tag);
                dbContext.SaveChanges();
            }
            catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return NoContent();
        }
    }
}