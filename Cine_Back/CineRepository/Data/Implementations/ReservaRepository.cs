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
    public class ReservaRepository : IReservaRepository
    {
        private readonly CineDbContext _context;

        public ReservaRepository(CineDbContext context)
        {
            _context = context;
        }
                
        public async Task<Reserva?> GetByIdAsync(int idReserva)
        {
            return await _context.Reservas
                    .Include(r => r.DetallesReservas)
                    .Include(r => r.Facturas)
                    .FirstOrDefaultAsync(r => r.IdReserva == idReserva);
        }

        public async Task<List<Reserva>> GetMisReservasAsync(int idCliente)
        {
            return await _context.Reservas
                        .Where(r => r.IdCliente == idCliente)
                        .ToListAsync();
        }

        public async Task<List<Reserva>> GetAllAsync()
        {
            return await _context.Reservas.ToListAsync();
        }

        public async Task PostReservaAsync(Reserva reserva)
        {
            await _context.Reservas.AddAsync(reserva);
        }

        public async Task<bool> DeleteByReservaAsync(int idReserva)
        {
            var ocupaciones = await _context.OcupacionesButacas
                                            .Include(o => o.DetalleReserva)
                                            .Where(o =>
                                                o.IdDetalleReserva != null &&
                                                o.DetalleReserva != null &&
                                                o.DetalleReserva.IdReserva == idReserva
                                            )
                                            .ToListAsync();

            if (!ocupaciones.Any())
                return false;

            _context.OcupacionesButacas.RemoveRange(ocupaciones);

            return true;
        }

        public async Task UpdateOcupWithFacturaAsync(int? idReserva, List<DetalleFactura>? detalles)
        {
            var ocupaciones = await _context.OcupacionesButacas
                .Include(o => o.DetalleReserva)
                .Where(o =>
                    o.IdDetalleReserva != null &&
                    o.DetalleReserva != null &&
                    o.DetalleReserva.IdReserva == idReserva
                )
                .ToListAsync();

            foreach (var ocupacion in ocupaciones)
            {
                var detalleFactura = _context.DetallesFacturas.FirstOrDefault(df =>
                    df.IdFuncion == ocupacion.IdFuncion &&
                    df.IdButaca == ocupacion.IdButaca
                );

                if (detalleFactura != null)
                {
                    ocupacion.IdDetalleFactura = detalleFactura.IdDetalleFactura;
                }
            }

            _context.OcupacionesButacas.UpdateRange(ocupaciones);
        }

        public async Task PostOcupByReservaAsync(List<OcupacionButaca> ocupaciones)
        {
            await _context.OcupacionesButacas.AddRangeAsync(ocupaciones);
        }
    }
}
