using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CineWebAPI.Controllers
{
    [Route("api/login")]
    [ApiController]
    public class JwtController : ControllerBase
    {
        private readonly IClienteService _clienteService;

        public JwtController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto user)
        {
            try
            {
                if (user == null)
                    return BadRequest(new { message = "Se requiere objeto LOGIN" });

                LoginResponseDto? response = await _clienteService.Login(user);
                if (response == null)
                    return Unauthorized(new { message = "Usuario y/o Password incorrecto" });

                var claims = new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, response.UserId.ToString()),
                    new Claim(ClaimTypes.Name, response.UserEmail),
                    new Claim(ClaimTypes.Role, response.IsAdmin ? "Admin" : "Client")
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("clave-super-secreta-para-poc-123456"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: "JwtAuthPoc",
                    audience: "JwtAuthPocUser",
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(30),
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                return Ok(new
                {
                    token = tokenString,
                    userId = response.UserId,
                    email = response.UserEmail,
                    isAdmin = response.IsAdmin
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = $"Error interno : {ex}" });
            }
        }
    }
}
