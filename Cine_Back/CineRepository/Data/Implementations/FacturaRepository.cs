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

        public async Task<Factura?> GetByIdAsync(int idFactura)
        {
            return await _context.Facturas
                .Include(f => f.DetallesFacturas)
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
    }
}
