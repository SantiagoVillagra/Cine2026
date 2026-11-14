using CineRepository.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Interfaces
{
    public interface IPeliculaService
    {
        Task<List<Pelicula>> ObtenerTodasAsync();
        Task<Pelicula?> ObtenerPorIdAsync(int id);
        Task<List<Pelicula>> ObtenerActivasAsync();
        Task CambiarEstadoAsync(int id, bool activa);
    }
}
