using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TechNovaAPI.Models;

namespace TechNovaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IDbConnection _db;
        private readonly IConfiguration _config;



        public AuthController(IDbConnection db, IConfiguration config)
        {
            _db = db;
            _config = config;                   
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _db.QueryFirstOrDefaultAsync<User>(
                "sp_GetUserByUsername",
                new { model.Username },
                commandType: CommandType.StoredProcedure);

            if (user == null)
                return Unauthorized("Invalid credentials");

            bool isValid = false;

            try
            {
                if (!string.IsNullOrEmpty(user.Password) && user.Password.StartsWith("$2"))
                {
                    // BCrypt password
                    isValid = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
                }
                else
                {
                    // Plain password fallback
                    isValid = user.Password == model.Password;
                }
            }
            catch
            {
                // If hash is corrupted → fallback safely
                isValid = user.Password == model.Password;
            }

            if (!isValid)
                return Unauthorized("Invalid credentials");

            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityTokenHandler().CreateToken(
                new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddHours(2),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256)
                });

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                role = user.Role
            });
        }
    }
}