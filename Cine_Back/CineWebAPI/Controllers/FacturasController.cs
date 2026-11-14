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

        // POST: api/facturas
        // Registra una venta directa desde boletería.
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CrearVentaDirecta(
            [FromBody] CrearFacturaDto facturaDto)
        {
            var factura = await _facturaService.CrearVentaDirectaAsync(facturaDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = factura.IdFactura },
                factura
            );
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

            var factura = await _facturaService.GetByIdAsync(id, idCliente, esAdmin);

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
