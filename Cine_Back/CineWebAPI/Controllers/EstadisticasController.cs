using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class EstadisticasController : ControllerBase
    {
        private readonly IEstadisticaService _service;

        public EstadisticasController(IEstadisticaService service)
        {
            _service = service;
        }

        [HttpGet("ingresos-por-mes")]
        public async Task<IActionResult> IngresosPorMes([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
            => await Ejecutar(() => _service.IngresosPorMesAsync(desde, hasta));

        [HttpGet("top-peliculas")]
        public async Task<IActionResult> TopPeliculas([FromQuery] int top = 10)
            => await Ejecutar(() => _service.TopPeliculasAsync(top));

        [HttpGet("ocupacion-por-horario")]
        public async Task<IActionResult> OcupacionPorHorario([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
            => await Ejecutar(() => _service.OcupacionPorHorarioAsync(desde, hasta));

        [HttpGet("uso-promociones")]
        public async Task<IActionResult> UsoPromociones()
            => await Ejecutar(() => _service.UsoPromocionesAsync());

        private async Task<IActionResult> Ejecutar(Func<Task<List<EstadisticaItemDto>>> consulta)
        {
            try
            {
                return Ok(await consulta());
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
