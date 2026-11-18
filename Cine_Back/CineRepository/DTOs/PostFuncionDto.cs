using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
        public class PostFuncionDto
        {
            [Required(ErrorMessage = "La fecha es obligatoria")]
            public DateTime? Fecha { get; set; }

            [Range(1, int.MaxValue, ErrorMessage = "IdHoraFuncion inválido")]
            public int IdHoraFuncion { get; set; }

            [Required(ErrorMessage = "El campo 'subtitulada' es obligatorio")]
            public bool? Subtitulada { get; set; }

            [Range(1, int.MaxValue, ErrorMessage = "IdPelicula inválido")]
            public int IdPelicula { get; set; }

            [Range(1, int.MaxValue, ErrorMessage = "IdSala inválido")]
            public int IdSala { get; set; }

            [Range(1, int.MaxValue, ErrorMessage = "IdIdioma inválido")]
            public int IdIdioma { get; set; }
        }
    }

