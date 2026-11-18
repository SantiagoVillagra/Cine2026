using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CineRepository.Data.Interfaces
{
    public interface IEstadisticaRepository
    {

        Task<List<EstadisticaItemDto>> GetIngresosPorMesAsync(DateTime? desde, DateTime? hasta);
        Task<List<EstadisticaItemDto>> GetTopPeliculasAsync(int top);
        Task<List<EstadisticaItemDto>> GetOcupacionPorHorarioAsync(DateTime? desde, DateTime? hasta);
        Task<List<EstadisticaItemDto>> GetUsoPromocionesAsync();
    }
}
