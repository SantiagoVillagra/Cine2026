using CineRepository.Data.Interfaces;
using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Implementations
{
    public class CatalogoService : ICatalogoService
    {
        private readonly ICatalogoRepository _catalogoRepository;

        public CatalogoService(ICatalogoRepository catalogoRepository)
        {
            _catalogoRepository = catalogoRepository;
        }

        public Task<List<CatalogoItemDto>> GetDirectoresAsync()
            => _catalogoRepository.GetDirectoresAsync();

        public Task<List<CatalogoItemDto>> GetActoresAsync()
            => _catalogoRepository.GetActoresAsync();

        public Task<List<CatalogoItemDto>> GetClasificacionesAsync()
            => _catalogoRepository.GetClasificacionesAsync();

        public Task<List<CatalogoItemDto>> GetGenerosAsync()
            => _catalogoRepository.GetGenerosAsync();

        public Task<List<CatalogoItemDto>> GetIdiomasAsync()
            => _catalogoRepository.GetIdiomasAsync();

        public Task<List<SalaDto>> GetSalasAsync()
            => _catalogoRepository.GetSalasAsync();
    }
}
