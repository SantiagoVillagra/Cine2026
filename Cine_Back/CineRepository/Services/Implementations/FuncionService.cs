using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using CineRepository.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CineRepository.DTOs;

namespace CineRepository.Services.Implementations
{
    public class FuncionService : IFuncionService
    {
        private const int MargenMinutos = 15; // limpieza/preparación entre funciones

        private readonly IFuncionRepository _funcionRepository;
        private readonly IPeliculaRepository _peliculaRepository;

        public FuncionService(IFuncionRepository funcionRepository,
                              IPeliculaRepository peliculaRepository)
        {
            _funcionRepository = funcionRepository;
            _peliculaRepository = peliculaRepository;
        }

        public async Task<Funcion> CrearAsync(PostFuncionDto dto)
        {
            // 1. Validar que existan las referencias, cada una con su mensaje
            Pelicula? pelicula = await _peliculaRepository.GetByIdAsync(dto.IdPelicula);
            if (pelicula == null)
                throw new KeyNotFoundException($"No existe la película con id: {dto.IdPelicula}");

            if (!pelicula.Activa)
                throw new InvalidOperationException(
                    $"La película '{pelicula.Titulo}' está inactiva y no se puede programar");

            if (!await _funcionRepository.ExisteSalaAsync(dto.IdSala))
                throw new KeyNotFoundException($"No existe la sala con id: {dto.IdSala}");

            if (!await _funcionRepository.ExisteIdiomaAsync(dto.IdIdioma))
                throw new KeyNotFoundException($"No existe el idioma con id: {dto.IdIdioma}");

            HorasFuncion? hora = await _funcionRepository.GetHoraAsync(dto.IdHoraFuncion);
            if (hora == null)
                throw new KeyNotFoundException(
                    $"No existe la hora de función con id: {dto.IdHoraFuncion}");

            // 2. Intervalo de la función nueva
            DateTime fecha = dto.Fecha!.Value.Date;
            DateTime inicioNuevo = fecha + hora.HoraFuncion; // AJUSTAR: nombre/tipo de la propiedad (TimeSpan)
            DateTime finNuevo = inicioNuevo.AddMinutes(pelicula.Duracion + MargenMinutos);

            // 3. Comparar contra las funciones de esa sala (día anterior, mismo día y siguiente)
            List<Funcion> existentes = await _funcionRepository
                .GetFuncionesDeSalaAsync(dto.IdSala, fecha.AddDays(-1), fecha.AddDays(1));

            foreach (Funcion f in existentes)
            {
                DateTime inicioExistente = f.Fecha.Date + f.HorasFuncion.HoraFuncion; // AJUSTAR
                DateTime finExistente = inicioExistente
                    .AddMinutes(f.Pelicula.Duracion + MargenMinutos);

                // Inicio1 < Fin2 AND Inicio2 < Fin1
                if (inicioNuevo < finExistente && inicioExistente < finNuevo)
                    throw new InvalidOperationException(
                        $"La sala {dto.IdSala} se superpone con la función {f.IdFuncion} " +
                        $"({inicioExistente:dd/MM HH:mm} a {finExistente:dd/MM HH:mm})");
            }

            // 4. Crear la función
            var funcion = new Funcion
            {
                Fecha = fecha,
                IdHoraFuncion = dto.IdHoraFuncion,
                Subtitulada = dto.Subtitulada!.Value,
                IdPelicula = dto.IdPelicula,
                IdSala = dto.IdSala,
                IdIdioma = dto.IdIdioma
            };

            return await _funcionRepository.CrearAsync(funcion);
        }
        // obtener todas las funciones 
        public async Task<List<FuncionResponseDto>> ObtenerFuncionesAsync(DateTime? fecha, int? idPelicula)
        {
            List<Funcion> funciones = await _funcionRepository.GetFuncionesAsync(fecha, idPelicula);

            return funciones
                .Select(f => new FuncionResponseDto
                {
                    IdFuncion = f.IdFuncion,
                    Fecha = f.Fecha.Date,
                    Hora = f.HorasFuncion.HoraFuncion,      // navegación . propiedad TimeSpan
                    Subtitulada = f.Subtitulada,
                    IdPelicula = f.IdPelicula,
                    TituloPelicula = f.Pelicula.Titulo,
                    IdSala = f.IdSala,
                    IdIdioma = f.IdIdioma
                })
                .OrderBy(f => f.Fecha)
                .ThenBy(f => f.Hora)
                .ToList();
        }

        // consltar butacas y sus estados 

        public async Task<List<ButacaFuncionDto>> ObtenerButacasAsync(int idFuncion)
        {
            Funcion? funcion = await _funcionRepository.GetFuncionByIdAsync(idFuncion);
            if (funcion == null)
                throw new KeyNotFoundException($"No existe la función con id: {idFuncion}");

            List<Butaca> butacas = await _funcionRepository.GetButacasDeSalaAsync(funcion.IdSala);

            HashSet<int> ocupadas = (await _funcionRepository.GetIdsButacasOcupadasAsync(idFuncion))
                                    .ToHashSet();

            return butacas
                .Select(b => new ButacaFuncionDto
                {
                    IdButaca = b.IdButaca,
                    Fila = b.Fila,
                    Numero = b.Numero,
                    Ocupada = ocupadas.Contains(b.IdButaca)
                })
                .ToList();
        }
    }
}