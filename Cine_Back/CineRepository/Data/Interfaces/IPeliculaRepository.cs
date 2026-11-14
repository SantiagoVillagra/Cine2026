using CineRepository.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Interfaces
{
    public interface IPeliculaRepository
    {
        Task<List<Pelicula>> GetAllAsync();
        Task<Pelicula?> GetByIdAsync(int id);

        Task ActualizarAsync(Pelicula pelicula);

        Task<List<Pelicula>> GetActivasAsync();
    }
}
