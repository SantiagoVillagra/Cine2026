using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Interfaces
{
    public interface ICatalogoRepository
    {
        Task<List<CatalogoItemDto>> GetDirectoresAsync();
        Task<List<CatalogoItemDto>> GetActoresAsync();
        Task<List<CatalogoItemDto>> GetClasificacionesAsync();
        Task<List<CatalogoItemDto>> GetGenerosAsync();
        Task<List<CatalogoItemDto>> GetIdiomasAsync();
        Task<List<SalaDto>> GetSalasAsync();
    }
}
