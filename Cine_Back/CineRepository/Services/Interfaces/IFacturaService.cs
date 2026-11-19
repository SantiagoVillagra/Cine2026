using CineRepository.Domain;
using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Interfaces
{
    public interface IFacturaService
    {
        Task<List<Factura>> TraerTodasAsync();
        Task<List<Factura>> TraerMisFacturasAsync(int idCliente);
        Task<Factura> CrearVentaDirectaAsync(PostFacturaDto factura);
        Task CrearVentaPorReservaAsync(Factura factura);
        Task<Factura?> TraerPorIdAsync(int idFactura, int idCliente, bool esAdmin);
    }
}
