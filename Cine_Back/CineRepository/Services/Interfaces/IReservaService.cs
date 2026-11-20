using CineRepository.Domain;
using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Interfaces
{
    public interface IReservaService
    {
        Task<Reserva> CrearReservaAsync(int idCliente, PostReservaDto detalles);
        Task<List<Reserva>> TraerTodasAsync();
        Task<List<Reserva>> TraerMisReservasAsync(int idCliente);
        Task<Reserva?> TraerPorIdAsync(int idReserva,int idCliente,bool esAdmin);
        Task<bool> CancelarAsync(int idReserva,int idCliente,bool esAdmin);
        Task<Factura> ConfirmarAsync(int idReserva,int idCliente,bool esAdmin,ConfirmarReservaDto dto);
    }
}
