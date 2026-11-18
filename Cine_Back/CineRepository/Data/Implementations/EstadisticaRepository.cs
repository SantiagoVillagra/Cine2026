using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CineRepository.Data.Implementations
{
    public class EstadisticaRepository : IEstadisticaRepository
    {
        private readonly CineDbContext _context;

        public EstadisticaRepository(CineDbContext context)
        {
            _context = context;
        }

        public async Task<List<EstadisticaItemDto>> GetIngresosPorMesAsync(DateTime? desde, DateTime? hasta)
        {
            IQueryable<DetalleFactura> query = _context.DetallesFacturas;

            if (desde.HasValue)
                query = query.Where(d => d.Factura!.FechaHoraEmision >= desde.Value.Date);

            if (hasta.HasValue)
                query = query.Where(d => d.Factura!.FechaHoraEmision < hasta.Value.Date.AddDays(1));

            var datos = await query
                .GroupBy(d => new
                {
                    Anio = d.Factura!.FechaHoraEmision.Year,
                    Mes = d.Factura.FechaHoraEmision.Month
                })
                .Select(g => new { g.Key.Anio, g.Key.Mes, Total = g.Sum(d => d.PrecioUnitario) })
                .OrderBy(x => x.Anio).ThenBy(x => x.Mes)
                .ToListAsync();

            return datos.Select(x => new EstadisticaItemDto
            {
                Etiqueta = $"{x.Anio}-{x.Mes:00}",
                Valor = x.Total
            }).ToList();
        }

        public async Task<List<EstadisticaItemDto>> GetTopPeliculasAsync(int top)
        {
            var datos = await _context.DetallesFacturas
                .GroupBy(d => d.Funcion!.Pelicula!.Titulo)
                .OrderByDescending(g => g.Count())
                .Take(top)
                .Select(g => new { Titulo = g.Key, Entradas = g.Count() })
                .ToListAsync();

            return datos.Select(x => new EstadisticaItemDto
            {
                Etiqueta = x.Titulo,
                Valor = x.Entradas
            }).ToList();
        }

        public async Task<List<EstadisticaItemDto>> GetOcupacionPorHorarioAsync(DateTime? desde, DateTime? hasta)
        {
            IQueryable<Funcion> funciones = _context.Funciones;
            IQueryable<OcupacionButaca> ocupaciones = _context.OcupacionesButacas;

            if (desde.HasValue)
            {
                funciones = funciones.Where(f => f.Fecha >= desde.Value.Date);
                ocupaciones = ocupaciones.Where(o => o.Funcion.Fecha >= desde.Value.Date);
            }
            if (hasta.HasValue)
            {
                funciones = funciones.Where(f => f.Fecha <= hasta.Value.Date);
                ocupaciones = ocupaciones.Where(o => o.Funcion.Fecha <= hasta.Value.Date);
            }

            // 1. Butacas por sala (pocas filas)
            var butacasPorSala = await _context.Butacas
                .GroupBy(b => b.IdSala)
                .Select(g => new { IdSala = g.Key, Cantidad = g.Count() })
                .ToDictionaryAsync(x => x.IdSala, x => x.Cantidad);

            // 2. Cuántas funciones hay por horario y sala
            var funcionesPorHoraSala = await funciones
                .GroupBy(f => new { f.IdHoraFuncion, f.IdSala })
                .Select(g => new { g.Key.IdHoraFuncion, g.Key.IdSala, Funciones = g.Count() })
                .ToListAsync();

            // 3. Butacas ocupadas por horario
            var ocupadas = await ocupaciones
                .GroupBy(o => o.Funcion.IdHoraFuncion)
                .Select(g => new { IdHora = g.Key, Ocupadas = g.Count() })
                .ToListAsync();

            List<HorasFuncion> horas = await _context.HorasFunciones
                .OrderBy(h => h.HoraFuncion)
                .ToListAsync();

            return horas.Select(h =>
            {
                // capacidad = suma de (funciones x butacas de su sala), calculada en memoria
                int capacidad = funcionesPorHoraSala
                    .Where(x => x.IdHoraFuncion == h.IdHoraFuncion)
                    .Sum(x => x.Funciones * (butacasPorSala.TryGetValue(x.IdSala, out int c) ? c : 0));

                int ocupada = ocupadas.FirstOrDefault(o => o.IdHora == h.IdHoraFuncion)?.Ocupadas ?? 0;

                return new EstadisticaItemDto
                {
                    Etiqueta = h.HoraFuncion.ToString(@"hh\:mm"),
                    Valor = capacidad > 0 ? Math.Round(ocupada * 100m / capacidad, 1) : 0
                };
            }).ToList();
        }

        public async Task<List<EstadisticaItemDto>> GetUsoPromocionesAsync()
        {
            var datos = await _context.DetallesFacturas
                .Where(d => d.IdPromocion != null)
                .GroupBy(d => d.Promocion!.Descripcion)
                .Select(g => new { Promocion = g.Key, Entradas = g.Count() })
                .OrderByDescending(x => x.Entradas)
                .ToListAsync();

            return datos.Select(x => new EstadisticaItemDto
            {
                Etiqueta = x.Promocion,
                Valor = x.Entradas
            }).ToList();
        }
    }
}
