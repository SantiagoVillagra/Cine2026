using CineRepository.Data.Interfaces;
using CineRepository.DTOs;
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
        public Task<bool> PostFactura(PostFacturaDto factura)
        {
            throw new NotImplementedException();
        }
    }
}
