using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using CineRepository.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Implementations
{
    public class PeliculaService : IPeliculaService
    {
        private readonly IPeliculaRepository _peliculaRepository;

        public PeliculaService(IPeliculaRepository peliculaRepository)
        {
            _peliculaRepository = peliculaRepository;
        }
        public async Task<Pelicula?> ObtenerPorIdAsync(int id)
        {
            return await _peliculaRepository.GetByIdAsync(id);
        }

        public async Task<List<Pelicula>> ObtenerTodasAsyc()
        {
            return await _peliculaRepository.GetAllAsync();
        }
    }
}
