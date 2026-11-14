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
    public class ReservasController : ControllerBase
    {
        private readonly IReservaService _reservaService;

        public ReservasController(IReservaService reservaService)
        {
            _reservaService = reservaService;
        }

        // GET: api/reservas
        // Consulta todas las reservas. Solo administradores.
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservas = await _reservaService.GetAllAsync();

            return Ok(reservas);
        }

        // GET: api/reservas/mis-reservas
        // Consulta las reservas del usuario autenticado.
        [Authorize(Roles = "Client")]
        [HttpGet("mis-reservas")]
        public async Task<IActionResult> GetMisReservas()
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            var reservas = await _reservaService.GetMisReservasAsync(idCliente);

            return Ok(reservas);
        }

        // GET: api/reservas/15
        // Consulta una reserva específica.
        [Authorize(Roles = "Client,Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            bool esAdmin = User.IsInRole("Admin");

            var reserva = await _reservaService.GetByIdAsync(id, idCliente, esAdmin);

            if (reserva == null)
                return NotFound(new
                {
                    message = "Reserva inexistente o sin permisos para consultarla."
                });

            return Ok(reserva);
        }

        // POST: api/reservas
        // Crea una reserva para el usuario autenticado.
        [Authorize(Roles = "Client")]
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] PostReservaDto reservaDto)
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            var reserva = await _reservaService.CrearAsync(idCliente, reservaDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = reserva.IdReserva },
                reserva
            );
        }

        // PATCH: api/reservas/15/cancelar
        // Cancela una reserva.
        [Authorize(Roles = "Client,Admin")]
        [HttpPatch("{id}/cancelar")]
        public async Task<IActionResult> Cancelar(int id)
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            bool esAdmin = User.IsInRole("Admin");

            await _reservaService.CancelarAsync(
                id,
                idCliente,
                esAdmin
            );

            return NoContent();
        }

        // POST: api/reservas/15/confirmar
        // Confirma el pago y genera la factura correspondiente.
        [Authorize(Roles = "Client,Admin")]
        [HttpPost("{id}/confirmar")]
        public async Task<IActionResult> Confirmar(
            int id,
            [FromBody] ConfirmarReservaDto confirmacionDto)
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            bool esAdmin = User.IsInRole("Admin");

            var factura = await _reservaService.ConfirmarAsync(
                id,
                idCliente,
                esAdmin,
                confirmacionDto
            );

            return Ok(factura);
        }

        // Obtiene el ID del usuario desde el JWT.
        private bool TryGetIdCliente(out int idCliente)
        {
            var claim = User.FindFirst(
                ClaimTypes.NameIdentifier
            )?.Value;

            return int.TryParse(claim, out idCliente);
        }
    }
}
