using CineRepository.Domain;
using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Interfaces
{
    public interface IReservaRepository
    {
        Task PostReservaAsync(Reserva reserva);
        Task<List<Reserva>> GetAllAsync();
        Task<List<Reserva>> GetMisReservasAsync(int idCliente);
        Task<Reserva?> GetByIdAsync(int idReserva);
        
        Task<bool> DeleteByReservaAsync(int idReserva);

        Task UpdateOcupWithFacturaAsync(int? idReserva, List<DetalleFactura> detalles);
        Task PostOcupByReservaAsync(List<OcupacionButaca> ocupaciones);
    }
}
