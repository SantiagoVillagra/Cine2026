using CineRepository.Domain;
using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Interfaces
{
    public interface IFacturaRepository
    {
        Task<Factura?> PostVentaDirectaAsync(Factura factura);
        Task<Factura?> PostVentaPorReservaAsync(Factura factura);
        Task<Factura?> GetByIdAsync(int idFactura);
    }
}
