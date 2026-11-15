using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Implementations
{
    public class PeliculaRepository : IPeliculaRepository
    {
        private readonly CineDbContext _context;

        public PeliculaRepository(CineDbContext context)
        {
            _context = context;
        }

        public async Task ActualizarAsync(Pelicula pelicula)
        {
            await _context.SaveChangesAsync();
        }

        public async Task<List<Pelicula>> GetActivasAsync()
        {
            return await _context.Peliculas
                                .Where(p => p.Activa)
                                .ToListAsync();
        }

        public async Task<List<Pelicula>> GetAllAsync()
        {
            return await _context.Peliculas
                                .Include(p => p.PeliculasGeneros)
                                    .ThenInclude(pg => pg.Genero)
                                .Include(p => p.ActoresPeliculas)
                                    .ThenInclude(ap => ap.Actor)
                                .ToListAsync();
        }

        public async Task<Pelicula?> GetByIdAsync(int id)
        {
            return await _context.Peliculas
                                .Include(p => p.PeliculasGeneros)
                                    .ThenInclude(pg => pg.Genero)
                                .Include(p => p.ActoresPeliculas)
                                    .ThenInclude(ap => ap.Actor)
                                .Where(p => p.IdPelicula == id)
                                .FirstOrDefaultAsync();
        }

        public async Task<Pelicula> CrearAsync(Pelicula pelicula)
        {
            _context.Peliculas.Add(pelicula);
            await _context.SaveChangesAsync(); // un solo SaveChanges: todo o nada
            return pelicula;
        }

        public async Task<bool> ExisteClasificacionAsync(int idClasificacion)
        {
            return await _context.Clasificaciones.AnyAsync(c => c.IdClasificacion == idClasificacion);
        }

        public async Task<bool> ExisteDirectorAsync(int idDirector)
        {
            return await _context.Directores.AnyAsync(d => d.IdDirector == idDirector);
        }

        public async Task<List<int>> ObtenerIdsGenerosExistentesAsync(List<int> idsGeneros)
        {
            return await _context.Generos
                .Where(g => idsGeneros.Contains(g.IdGenero))
                .Select(g => g.IdGenero)
                .ToListAsync();
        }

        public async Task<List<int>> ObtenerIdsActoresExistentesAsync(List<int> idsActores)
        {
            return await _context.Actores
                .Where(a => idsActores.Contains(a.IdActor))
                .Select(a => a.IdActor)
                .ToListAsync();
        }
    }
}
