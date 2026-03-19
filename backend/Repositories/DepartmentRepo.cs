using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using TechNovaAPI.Models;

public class DepartmentRepo
{
    private readonly IDbConnection _db;

    public DepartmentRepo(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Department>> GetAll()
    {
        return await _db.QueryAsync<Department>(
            "sp_GetDepartments",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Department> GetById(int id)
    {
        return await _db.QueryFirstOrDefaultAsync<Department>(
            "sp_GetDepartmentById",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task Add(Department dept)
    {
        await _db.ExecuteAsync("sp_AddDepartment",
            new
            {
                Code = dept.DepartmentCode,
                Name = dept.DepartmentName
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task Update(Department dept)
    {
        await _db.ExecuteAsync("sp_UpdateDepartment",
            new
            {
                Id = dept.Id,
                Code = dept.DepartmentCode,
                Name = dept.DepartmentName
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task Delete(int id)
    {
        await _db.ExecuteAsync("sp_DeleteDepartment",
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }
}