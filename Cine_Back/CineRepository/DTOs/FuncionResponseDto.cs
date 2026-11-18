using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class FuncionResponseDto
    {
        public int IdFuncion { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
        public bool Subtitulada { get; set; }
        public int IdPelicula { get; set; }
        public string TituloPelicula { get; set; } = string.Empty;
        public int IdSala { get; set; }
        public int IdIdioma { get; set; }
    }
}
