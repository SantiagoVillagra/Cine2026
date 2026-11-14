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

        public async Task CambiarEstadoAsync(int id, bool activa)
        {
            Pelicula? pelicula = await _peliculaRepository.GetByIdAsync(id);

            if (pelicula == null)
                throw new KeyNotFoundException($"No existe película con id: {id}");

            if (pelicula.Activa == activa)
                throw new InvalidOperationException(
                    $"La película ya se encuentra {(activa ? "activa" : "inactiva")}");

            pelicula.Activa = activa;
            await _peliculaRepository.ActualizarAsync(pelicula);
        }

        public async Task<List<Pelicula>> ObtenerActivasAsync()
        {
            return await _peliculaRepository.GetActivasAsync();
        }

        public async Task<Pelicula?> ObtenerPorIdAsync(int id)
        {
            return await _peliculaRepository.GetByIdAsync(id);
        }

        public async Task<List<Pelicula>> ObtenerTodasAsync()
        {
            return await _peliculaRepository.GetAllAsync();
        }
    }
}
