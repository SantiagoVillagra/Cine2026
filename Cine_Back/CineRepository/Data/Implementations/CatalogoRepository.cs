using CineRepository.Data.Interfaces;
using CineRepository.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Implementations
{
    public class CatalogoRepository : ICatalogoRepository
    {
        private readonly CineDbContext _context;

        public CatalogoRepository(CineDbContext context)
        {
            _context = context;
        }

        public async Task<List<CatalogoItemDto>> GetDirectoresAsync()
        {
            return await _context.Directores
                .AsNoTracking()
                .OrderBy(d => d.Nombre)
                .Select(d => new CatalogoItemDto { Id = d.IdDirector, Nombre = d.Nombre })
                .ToListAsync();
        }

        public async Task<List<CatalogoItemDto>> GetActoresAsync()
        {
            return await _context.Actores
                .AsNoTracking()
                .OrderBy(a => a.Nombre)
                .Select(a => new CatalogoItemDto { Id = a.IdActor, Nombre = a.Nombre })
                .ToListAsync();
        }

        public async Task<List<CatalogoItemDto>> GetClasificacionesAsync()
        {
            return await _context.Clasificaciones
                .AsNoTracking()
                .OrderBy(c => c.Descripcion)
                .Select(c => new CatalogoItemDto { Id = c.IdClasificacion, Nombre = c.Descripcion })
                .ToListAsync();
        }

        public async Task<List<CatalogoItemDto>> GetGenerosAsync()
        {
            return await _context.Generos
                .AsNoTracking()
                .OrderBy(g => g.Nombre)
                .Select(g => new CatalogoItemDto { Id = g.IdGenero, Nombre = g.Nombre })
                .ToListAsync();
        }

        public async Task<List<CatalogoItemDto>> GetIdiomasAsync()
        {
            return await _context.Idiomas
                .AsNoTracking()
                .OrderBy(i => i.Descripcion)
                .Select(i => new CatalogoItemDto { Id = i.IdIdioma, Nombre = i.Descripcion })
                .ToListAsync();
        }

        public async Task<List<SalaDto>> GetSalasAsync()
        {
            return await _context.Salas
                .AsNoTracking()
                .OrderBy(s => s.NumeroSala)
                .Select(s => new SalaDto
                {
                    IdSala = s.IdSala,
                    NumeroSala = s.NumeroSala,
                    Capacidad = s.Capacidad,
                    IdTipoSala = s.IdTipoSala
                })
                .ToListAsync();
        }
    }
}
