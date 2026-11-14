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
        Task<bool> PostReserva(PostReservaDto detalles);
    }
}
