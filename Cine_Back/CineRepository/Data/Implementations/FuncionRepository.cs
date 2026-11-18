using CineRepository.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CineRepository.Data.Interfaces;
using CineRepository.DTOs;
using CineRepository.Domain;

namespace CineRepository.Data.Implementations
{
    public class FuncionRepository : IFuncionRepository
    {
        private readonly CineDbContext _context;

        public FuncionRepository(CineDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExisteSalaAsync(int idSala)
        {
            return await _context.Salas.AnyAsync(s => s.IdSala == idSala); // AJUSTAR: DbSet y propiedad
        }

        public async Task<bool> ExisteIdiomaAsync(int idIdioma)
        {
            return await _context.Idiomas.AnyAsync(i => i.IdIdioma == idIdioma); // AJUSTAR: DbSet y propiedad
        }

        public async Task<HorasFuncion?> GetHoraAsync(int idHoraFuncion)
        {
            return await _context.HorasFunciones
                                 .FirstOrDefaultAsync(h => h.IdHoraFuncion == idHoraFuncion); // AJUSTAR: DbSet
        }

        public async Task<List<Funcion>> GetFuncionesDeSalaAsync(int idSala, DateTime desde, DateTime hasta)
        {
            return await _context.Funciones
                                 .Include(f => f.Pelicula)       // AJUSTAR: navegación a Pelicula
                                 .Include(f => f.HorasFuncion)    // AJUSTAR: navegación a HorasFuncion
                                 .Where(f => f.IdSala == idSala
                                          && f.Fecha >= desde
                                          && f.Fecha <= hasta)
                                 .ToListAsync();
        }

        public async Task<Funcion> CrearAsync(Funcion funcion)
        {
            _context.Funciones.Add(funcion);
            await _context.SaveChangesAsync();
            return funcion;
        }
        // funciones get all
        public async Task<List<Funcion>> GetFuncionesAsync(DateTime? fecha, int? idPelicula)
        {
            IQueryable<Funcion> query = _context.Funciones
                                                .Include(f => f.Pelicula)       // mismos nombres que en GetFuncionesDeSalaAsync
                                                .Include(f => f.HorasFuncion);

            if (fecha.HasValue)
                query = query.Where(f => f.Fecha == fecha.Value.Date);

            if (idPelicula.HasValue)
                query = query.Where(f => f.IdPelicula == idPelicula.Value);

            return await query.OrderBy(f => f.Fecha).ToListAsync();
        }
        // desde aca para chequear estado butaca
        public async Task<Funcion?> GetFuncionByIdAsync(int idFuncion)
        {
            return await _context.Funciones
                                 .FirstOrDefaultAsync(f => f.IdFuncion == idFuncion);
        }

        public async Task<List<Butaca>> GetButacasDeSalaAsync(int idSala)
        {
            return await _context.Butacas
                                 .Where(b => b.IdSala == idSala)
                                 .OrderBy(b => b.Fila)
                                 .ThenBy(b => b.Numero)
                                 .ToListAsync();
        }

        public async Task<List<int>> GetIdsButacasOcupadasAsync(int idFuncion)
        {
            return await _context.OcupacionesButacas
                                 .Where(o => o.IdFuncion == idFuncion)
                                 .Select(o => o.IdButaca)
                                 .ToListAsync();
        }
    }
}
