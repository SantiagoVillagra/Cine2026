using CineRepository.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CineRepository.DTOs;

namespace CineRepository.Services.Interfaces
{
    public interface IFuncionService
    {
        Task<Funcion> CrearAsync(PostFuncionDto dto);
        
        Task<List<FuncionResponseDto>> ObtenerFuncionesAsync(DateTime? fecha, int? idPelicula);

        Task<List<ButacaFuncionDto>> ObtenerButacasAsync(int idFuncion);

        Task EliminarAsync(int idFuncion);
    }
}
