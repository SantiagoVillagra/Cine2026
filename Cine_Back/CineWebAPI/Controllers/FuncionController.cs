using CineRepository.Domain;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CineRepository.DTOs;

namespace CineWebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FuncionesController : ControllerBase
    {
        private readonly IFuncionService _funcionService;

        public FuncionesController(IFuncionService funcionService)
        {
            _funcionService = funcionService;
        }

       // [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PostFuncionDto dto)
        {
            try
            {
                Funcion funcion = await _funcionService.CrearAsync(dto);
                return StatusCode(201, new { funcion.IdFuncion });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // 404: película, sala, idioma u hora inexistente
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message); // 409: película inactiva o sala ocupada
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        // get all funciones 
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] DateTime? fecha, [FromQuery] int? idPelicula)
        {
            try
            {
                List<FuncionResponseDto> funciones = await _funcionService.ObtenerFuncionesAsync(fecha, idPelicula);
                return Ok(funciones);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        // consultar butacas u estado

        [AllowAnonymous]
        [HttpGet("{id:int}/butacas")]
        public async Task<IActionResult> GetButacas(int id)
        {
            try
            {
                List<ButacaFuncionDto> butacas = await _funcionService.ObtenerButacasAsync(id);
                return Ok(butacas);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // 404: la función no existe
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _funcionService.EliminarAsync(id);
                return NoContent(); // 204
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // 404: la función no existe
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message); // 409: tiene reservas o facturas
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }

}