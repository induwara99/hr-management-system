using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using TechNovaAPI.Models;

public class EmployeeRepo
{
    private readonly IDbConnection _db;

    public EmployeeRepo(IDbConnection db)
    {
        _db = db;
    }

    // 🔹 GET ALL (JOINED DATA)
    public async Task<IEnumerable<Employee>> GetAll()
    {
        return await _db.QueryAsync<Employee>(
            "sp_GetEmployees",
            commandType: CommandType.StoredProcedure);
    }

    // 🔹 ADD
    public async Task Add(Employee emp)
    {
        try
        {
            await _db.ExecuteAsync("sp_AddEmployee",
                new
                {
                    Code = emp.EmployeeCode,
                    FirstName = emp.FirstName,
                    LastName = emp.LastName,
                    Email = emp.Email,
                    DOB = emp.DOB,
                    Salary = emp.Salary,
                    DepartmentId = emp.DepartmentId
                },
                commandType: CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message); // bubble real error
        }
    }

    // 🔹 UPDATE
    public async Task Update(Employee emp)
    {
        await _db.ExecuteAsync("sp_UpdateEmployee",
            new
            {
                Id = emp.Id,
                Code = emp.EmployeeCode,
                FirstName = emp.FirstName,
                LastName = emp.LastName,
                Email = emp.Email,
                DOB = emp.DOB,
                Salary = emp.Salary,
                DepartmentId = emp.DepartmentId
            },
            commandType: CommandType.StoredProcedure);
    }

    // 🔹 DELETE (SOFT)
    public async Task Delete(int id)
    {
        await _db.ExecuteAsync("sp_DeleteEmployee",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }
}