using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using TechNovaAPI.Constants;
using TechNovaAPI.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentController : ControllerBase
{
    private readonly DepartmentRepo _repo;

    public DepartmentController(DepartmentRepo repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _repo.GetAll());

    [Authorize(Roles = Roles.Admin + "," + Roles.HR)]
    [HttpPost]
    public async Task<IActionResult> Post(Department dept)
    {
        if (string.IsNullOrWhiteSpace(dept.DepartmentCode))
            return BadRequest("Code required");

        if (string.IsNullOrWhiteSpace(dept.DepartmentName))
            return BadRequest("Name required");

        await _repo.Add(dept);
        return Ok(new { message = "Department Created" });
    }

    [Authorize(Roles = Roles.Admin + "," + Roles.HR)]
    [HttpPut]
    public async Task<IActionResult> Put(Department dept)
    {
        if (dept.Id == 0)
            return BadRequest("Invalid ID");

        await _repo.Update(dept);
        return Ok(new { message = "Department Updated" });
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repo.Delete(id);
        return Ok(new { message = "Department Deleted" });
    }
}