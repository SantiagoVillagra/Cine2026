using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CineWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdiomasController : ControllerBase
    {
        private readonly ICatalogoService _catalogoService;

        public IdiomasController(ICatalogoService catalogoService)
        {
            _catalogoService = catalogoService;
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                List<CatalogoItemDto> idiomas = await _catalogoService.GetIdiomasAsync();
                return Ok(idiomas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
