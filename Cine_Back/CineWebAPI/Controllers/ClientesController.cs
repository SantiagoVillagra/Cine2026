using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CineWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _clienteService;

        public ClientesController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        // GET: api/clientes/perfil
        // Devuelve los datos del usuario autenticado.
        [Authorize]
        [HttpGet("perfil")]
        public async Task<IActionResult> GetPerfil()
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            try
            {
                PerfilDto? perfil = await _clienteService.GetPerfilAsync(idCliente);

                if (perfil == null)
                    return NotFound(new { message = "No se encontró el perfil del usuario." });

                return Ok(perfil);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private bool TryGetIdCliente(out int idCliente)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out idCliente);
        }
    }
}
