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
        Task PostVentaDirectaAsync(Factura factura);
        Task PostVentaPorReservaAsync(Factura factura);
        Task<Factura?> GetByIdAsync(int idFactura);
    }
}
