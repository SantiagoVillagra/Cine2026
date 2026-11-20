using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenerosController : ControllerBase
    {
        private readonly ICatalogoService _catalogoService;

        public GenerosController(ICatalogoService catalogoService)
        {
            _catalogoService = catalogoService;
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                List<CatalogoItemDto> generos = await _catalogoService.GetGenerosAsync();
                return Ok(generos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
