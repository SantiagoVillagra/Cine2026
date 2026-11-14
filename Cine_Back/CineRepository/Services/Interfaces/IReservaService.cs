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
        Task<bool> CrearReserva(PostReservaDto detalles);
    }
}
