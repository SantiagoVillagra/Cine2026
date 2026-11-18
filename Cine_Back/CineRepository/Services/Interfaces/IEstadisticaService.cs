using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CineRepository.Services.Interfaces
{
    public interface IEstadisticaService
    {
        Task<List<EstadisticaItemDto>> IngresosPorMesAsync(DateTime? desde, DateTime? hasta);
        Task<List<EstadisticaItemDto>> TopPeliculasAsync(int top);
        Task<List<EstadisticaItemDto>> OcupacionPorHorarioAsync(DateTime? desde, DateTime? hasta);
        Task<List<EstadisticaItemDto>> UsoPromocionesAsync();
    }
}
