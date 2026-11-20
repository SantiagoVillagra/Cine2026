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
            try
            {
                var reservas = await _reservaService.TraerTodasAsync();

                return Ok(reservas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/reservas/mis-reservas
        // Consulta las reservas del usuario autenticado.
        [Authorize(Roles = "Client")]
        [HttpGet("mis-reservas")]
        public async Task<IActionResult> GetMisReservas()
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            var reservas = await _reservaService.TraerMisReservasAsync(idCliente);

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

            var reserva = await _reservaService.TraerPorIdAsync(id, idCliente, esAdmin);

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

            if (reservaDto.Detalles.Count == 0)
                return BadRequest(new
                {
                    message= "Debe seleccionar butacas para reservar."
                });

            try
            {
                var reserva = await _reservaService.CrearReservaAsync(idCliente, reservaDto);

                return CreatedAtAction(nameof(GetById), new { id = reserva.IdReserva }, reserva);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message = "Ocurrió un error interno en el servidor."
                });
            }
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

            try
            {
                bool cancelado = await _reservaService.CancelarAsync(id, idCliente, esAdmin);

                if (cancelado)
                    return Ok("Reserva cancelada");

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message = "Ocurrió un error interno en el servidor."
                });
            }
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

            try
            {
                var factura = await _reservaService.ConfirmarAsync(id, idCliente, esAdmin, confirmacionDto);

                return Ok(factura);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message = "Ocurrió un error interno en el servidor."
                });
            }
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
