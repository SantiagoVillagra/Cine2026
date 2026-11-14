using CineRepository.Domain;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
                List<Pelicula> lPeliculas = await _peliculaService.ObtenerTodasAsyc();

                return Ok(lPeliculas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[Authorize(Roles = "Admin")]
        [Authorize]
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
    }
}
