using CineRepository.Domain;
using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeliculasController : ControllerBase
    {
        private readonly IPeliculaService _peliculaService;

        public PeliculasController(IPeliculaService peliculaService)
        {
            _peliculaService = peliculaService;
        }

        [AllowAnonymous]
        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                List<Pelicula> lPeliculas = await _peliculaService.ObtenerTodasAsync();

                return Ok(lPeliculas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

       // [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                Pelicula? pelicula = await _peliculaService.ObtenerPorIdAsync(id);

                if(pelicula == null)
                {
                    return NotFound($"No existe pélicula con id: {id}");
                }

                return Ok(pelicula);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[Authorize(Roles = "Admin")]
        
        [HttpPut("{id:int}/estado")]
        public async Task<IActionResult> ChangeState(int id, [FromBody] CambiarEstadoDto dto)
        {
            try
            {
                await _peliculaService.CambiarEstadoAsync(id, dto.Activa!.Value);
                return NoContent(); // 204
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // 404
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message); // 409
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PostPeliculaDto dto)
        {
            try
            {
                Pelicula pelicula = await _peliculaService.CrearAsync(dto);
                return StatusCode(201, new { pelicula.IdPelicula });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // 404
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            // este catch es para depurar errores
            //catch (Exception ex)
            //{
            //    return BadRequest(ex.InnerException?.Message ?? ex.Message);
            //}



            //Qué mandás mal                Respuesta
            //    idClasificacion:          99 404 “No existe la clasificación con id: 99”
            //    idDirector:               99  404 “No existe el director con id: 99”
            //    idsGeneros: [1, 50, 60]   404 “No existen los géneros con id: 50, 60”
            //    idsActores: [4, 77]       404 “No existen los actores con id: 77”
            //    Título vacío, duración 0, etc.	400 con el campo que falló
            //    Sin token / no Admin      401 / 403


        }
    }
}
