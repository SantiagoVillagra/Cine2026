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
        Task<Reserva> PostReservaAsync(Reserva reserva);
        Task<List<Reserva>> GetAllAsync();
        Task<List<Reserva>> GetMisReservasAsync(int idCliente);
        Task<Reserva?> GetByIdAsync(int idReserva);
        Task<bool> CancelAsync(int idReserva, int idCliente, bool esAdmin);
        Task<Factura> ConfirmAsync(int idReserva, int idCliente, bool esAdmin, ConfirmarReservaDto dto);
    }
}
