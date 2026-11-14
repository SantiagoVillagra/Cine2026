using CineRepository.Data.Interfaces;
using CineRepository.DTOs;
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
        public Task<bool> PostReserva(PostReservaDto detalles)
        {
            throw new NotImplementedException();
        }
    }
}
