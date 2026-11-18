using CineRepository.Data.Interfaces;
using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CineRepository.Services.Implementations
{
    public class EstadisticaService : IEstadisticaService
    {
        private readonly IEstadisticaRepository _repository;

        public EstadisticaService(IEstadisticaRepository repository)
        {
            _repository = repository;
        }

        public Task<List<EstadisticaItemDto>> IngresosPorMesAsync(DateTime? desde, DateTime? hasta)
        {
            ValidarRango(desde, hasta);
            return _repository.GetIngresosPorMesAsync(desde, hasta);
        }

        public Task<List<EstadisticaItemDto>> TopPeliculasAsync(int top)
        {
            if (top < 1 || top > 50)
                throw new ArgumentException("El parámetro 'top' debe estar entre 1 y 50");

            return _repository.GetTopPeliculasAsync(top);
        }

        public Task<List<EstadisticaItemDto>> OcupacionPorHorarioAsync(DateTime? desde, DateTime? hasta)
        {
            ValidarRango(desde, hasta);
            return _repository.GetOcupacionPorHorarioAsync(desde, hasta);
        }

        public Task<List<EstadisticaItemDto>> UsoPromocionesAsync()
        {
            return _repository.GetUsoPromocionesAsync();
        }

        private static void ValidarRango(DateTime? desde, DateTime? hasta)
        {
            if (desde.HasValue && hasta.HasValue && desde.Value.Date > hasta.Value.Date)
                throw new ArgumentException("'desde' no puede ser posterior a 'hasta'");
        }
    }
}
