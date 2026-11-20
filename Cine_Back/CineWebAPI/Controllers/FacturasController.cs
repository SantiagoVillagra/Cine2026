using CineRepository.DTOs;
using CineRepository.Services.Implementations;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CineWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        public readonly IFacturaService _facturaService;

        public FacturasController(IFacturaService facturaService)
        {
            _facturaService = facturaService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var facturas = await _facturaService.TraerTodasAsync();

                return Ok(facturas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Client")]
        [HttpGet("mis-facturas")]
        public async Task<IActionResult> GetMisFacturas()
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            var facturas = await _facturaService.TraerMisFacturasAsync(idCliente);

            return Ok(facturas);
        }

        // POST: api/facturas
        // Registra una venta directa desde boletería.
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CrearVentaDirecta([FromBody] PostFacturaDto facturaDto)
        {
            TryGetIdCliente(out int idCliente);

            if (User.IsInRole("Client"))
                facturaDto.IdCliente = idCliente;
                

            if (facturaDto.Detalles.Count == 0)
                return BadRequest(new
                {
                    message = "Debe seleccionar butacas para reservar."
                });

            try
            {
                var factura = await _facturaService.CrearVentaDirectaAsync(facturaDto);

                return CreatedAtAction(nameof(GetById), new { id = factura.IdFactura }, factura);
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

        // GET: api/facturas/20
        // Consulta una factura.
        [Authorize(Roles = "Client,Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!TryGetIdCliente(out int idCliente))
                return Unauthorized();

            bool esAdmin = User.IsInRole("Admin");

            var factura = await _facturaService.TraerPorIdAsync(id, idCliente, esAdmin);

            if (factura == null)
                return NotFound(new
                {
                    message = "Factura inexistente o sin permisos para consultarla."
                });

            return Ok(factura);
        }

        private bool TryGetIdCliente(out int idCliente)
        {
            var claim = User.FindFirst(
                ClaimTypes.NameIdentifier
            )?.Value;

            return int.TryParse(claim, out idCliente);
        }
    }
}
