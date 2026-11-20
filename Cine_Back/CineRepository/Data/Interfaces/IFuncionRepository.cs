using CineRepository.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CineRepository.Data.Interfaces
{
    public  interface IFuncionRepository
    {
        Task<bool> ExisteSalaAsync(int idSala);
        Task<bool> ExisteIdiomaAsync(int idIdioma);
        Task<HorasFuncion?> GetHoraAsync(int idHoraFuncion);
        Task<List<Funcion>> GetFuncionesDeSalaAsync(int idSala, DateTime desde, DateTime hasta);
        Task<Funcion> CrearAsync(Funcion funcion);
        // apra funciones 
        Task<List<Funcion>> GetFuncionesAsync(DateTime? fecha, int? idPelicula);
        // aca van lo de consultar butaca por funcion (ocupada, reservada)
        Task<Funcion?> GetFuncionByIdAsync(int idFuncion);
        Task<List<Butaca>> GetButacasDeSalaAsync(int idSala);
        Task<List<int>> GetIdsButacasOcupadasAsync(int idFuncion);

        Task<bool> TieneReservasAsync(int idFuncion);
        Task<bool> TieneFacturasAsync(int idFuncion);
        Task EliminarAsync(Funcion funcion);

    }
}
