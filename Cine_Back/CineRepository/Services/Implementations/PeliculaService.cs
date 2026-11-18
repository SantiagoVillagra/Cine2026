using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using CineRepository.DTOs;
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

        public async Task<Pelicula> CrearAsync(PostPeliculaDto dto)
        {
            // 1. Sacar repetidos para no crear filas duplicadas en las tablas puente
            List<int> idsGeneros = dto.IdsGeneros.Distinct().ToList();
            List<int> idsActores = dto.IdsActores.Distinct().ToList();

            // 2. Validar cada referencia, con un mensaje específico
            if (!await _peliculaRepository.ExisteClasificacionAsync(dto.IdClasificacion))
                throw new KeyNotFoundException($"No existe la clasificación con id: {dto.IdClasificacion}");

            if (!await _peliculaRepository.ExisteDirectorAsync(dto.IdDirector))
                throw new KeyNotFoundException($"No existe el director con id: {dto.IdDirector}");

            List<int> generosExistentes = await _peliculaRepository.ObtenerIdsGenerosExistentesAsync(idsGeneros);
            List<int> generosFaltantes = idsGeneros.Except(generosExistentes).ToList();
            if (generosFaltantes.Any())
                throw new KeyNotFoundException($"No existen los géneros con id: {string.Join(", ", generosFaltantes)}");

            List<int> actoresExistentes = await _peliculaRepository.ObtenerIdsActoresExistentesAsync(idsActores);
            List<int> actoresFaltantes = idsActores.Except(actoresExistentes).ToList();
            if (actoresFaltantes.Any())
                throw new KeyNotFoundException($"No existen los actores con id: {string.Join(", ", actoresFaltantes)}");

            // 3. Armar la película con sus filas puente
            var pelicula = new Pelicula
            {
                Titulo = dto.Titulo,
                Duracion = dto.Duracion,
                IdClasificacion = dto.IdClasificacion,
                IdDirector = dto.IdDirector,
                FechaEstreno = dto.FechaEstreno!.Value,
                Poster = dto.Poster,
                Sinopsis = dto.Sinopsis,
                Activa = true,
                PeliculasGeneros = idsGeneros.Select(id => new PeliculaGenero { IdGenero = id }).ToList(),
                ActoresPeliculas = idsActores.Select(id => new ActorPelicula { IdActor = id }).ToList()
            };

            // 4. Guardar todo junto
            return await _peliculaRepository.CrearAsync(pelicula);
        }
    }
}
