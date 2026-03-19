using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TechNovaAPI.Constants;
using TechNovaAPI.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeRepo _repo;

    public EmployeeController(EmployeeRepo repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _repo.GetAll());

    // 🔥 Admin + HR
    [Authorize(Roles = Roles.Admin + "," + Roles.HR)]
    [HttpPost]
    public async Task<IActionResult> Post(Employee emp)
    {
        if (string.IsNullOrWhiteSpace(emp.FirstName))
            return BadRequest("First Name required");

        if (emp.DepartmentId == 0)
            return BadRequest("Department required");

        if (emp.DOB == null)
            return BadRequest("Date of Birth required");

        var dob = emp.DOB.Value;

        emp.Age = DateTime.Now.Year - dob.Year;
        if (DateTime.Now.Date < dob.AddYears(emp.Age))
            emp.Age--;

        await _repo.Add(emp);

        return Ok(new { message = "Employee Added Successfully" });
    }

    [Authorize(Roles = Roles.Admin + "," + Roles.HR)]
    [HttpPut]
    public async Task<IActionResult> Put(Employee emp)
    {
        if (emp.Id == 0)
            return BadRequest("Invalid ID");

        await _repo.Update(emp);
        return Ok(new { message = "Employee Updated" });
    }

    // 🔥 ONLY ADMIN DELETE
    [Authorize(Roles = Roles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repo.Delete(id);
        return Ok(new { message = "Employee Deleted" });
    }
}