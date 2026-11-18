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

        public async Task<bool> CancelAsync(int idReserva, int idCliente, bool esAdmin)
        {
            throw new NotImplementedException();
        }

        public async Task<Factura> ConfirmAsync(int idReserva, int idCliente, bool esAdmin, ConfirmarReservaDto dto)
        {
            throw new NotImplementedException();
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

        public async Task<Reserva> PostReservaAsync(Reserva reserva)
        {
            await _context.Reservas.AddAsync(reserva);
            return reserva; //Corregir, obtenemos el ultimo insert o mandamos un bool?
        }
    }
}
