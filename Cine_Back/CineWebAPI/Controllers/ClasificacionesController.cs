using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasificacionesController : ControllerBase
    {
        private readonly ICatalogoService _catalogoService;

        public ClasificacionesController(ICatalogoService catalogoService)
        {
            _catalogoService = catalogoService;
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                List<CatalogoItemDto> clasificaciones = await _catalogoService.GetClasificacionesAsync();
                return Ok(clasificaciones);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
