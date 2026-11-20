using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using CineRepository.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Implementations
{
    public class FacturaRepository : IFacturaRepository
    {
        private readonly CineDbContext _context;

        public FacturaRepository(CineDbContext context)
        {
            _context = context;
        }

        //public async Task<Factura?> GetByIdAsync(int idFactura)
        //{
        //    return await _context.Facturas
        //        .Include(f => f.DetallesFacturas)
        //        .ThenInclude(df => df.Butaca)
        //        .FirstOrDefaultAsync(f => f.IdFactura == idFactura);
        //}

        public async Task<Factura?> GetByIdAsync(int idFactura)
        {
            return await FacturasConDetalle()
                .FirstOrDefaultAsync(f => f.IdFactura == idFactura);
        }
        public async Task PostVentaDirectaAsync(Factura factura)
        {
            await _context.Facturas.AddAsync(factura);
        }

        public async Task PostVentaPorReservaAsync(Factura factura)
        {
            await _context.Facturas.AddAsync(factura);
        }

        //public async Task<List<Factura>> GetAllAsync()
        //{
        //    return await _context.Facturas

        //                         .Include(f => f.DetallesFacturas)
        //                         .ThenInclude(df => df.Butaca)
        //                         .OrderByDescending(f => f.FechaHoraEmision)
        //                         .Take(50)
        //                         .ToListAsync();

        //}

        public async Task<List<Factura>> GetAllAsync()
        {
            return await FacturasConDetalle()
                .OrderByDescending(f => f.FechaHoraEmision)
                .Take(50)
                .ToListAsync();
        }
        //public async Task<List<Factura>> GetMisFacturasAsync(int idCliente)
        //{
        //    return await _context.Facturas

        //                .Include(f => f.DetallesFacturas)
        //                .ThenInclude(df => df.Butaca)
        //                .Where(f => f.IdCliente == idCliente)
        //                .OrderByDescending(f => f.FechaHoraEmision)

        //                .ToListAsync();
        //}
        public async Task<List<Factura>> GetMisFacturasAsync(int idCliente)
        {
            return await FacturasConDetalle()
                .Where(f => f.IdCliente == idCliente)
                .OrderByDescending(f => f.FechaHoraEmision)
                .ToListAsync();
        }
        private IQueryable<Factura> FacturasConDetalle()
        {
            return _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.DetallesFacturas).ThenInclude(df => df.Butaca)
                .Include(f => f.DetallesFacturas).ThenInclude(df => df.Funcion).ThenInclude(fu => fu.Pelicula)
                .Include(f => f.DetallesFacturas).ThenInclude(df => df.Funcion).ThenInclude(fu => fu.HorasFuncion);
        }
    }
}
