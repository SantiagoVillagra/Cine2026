using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class PostPeliculaDto
    {

        [Required(ErrorMessage = "El título es obligatorio")]
        public string Titulo { get; set; } = string.Empty;

        [Range(1, 600, ErrorMessage = "La duración debe ser mayor a 0 minutos")]
        public int Duracion { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "IdClasificacion inválido")]
        public int IdClasificacion { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "IdDirector inválido")]
        public int IdDirector { get; set; }

        [Required(ErrorMessage = "La fecha de estreno es obligatoria")]
        public DateTime? FechaEstreno { get; set; }
        
        [Required(ErrorMessage = "Debe proporcionar el link del poster")]
        public string? Poster { get; set; }

        public string? Sinopsis { get; set; }

        [Required(ErrorMessage = "Debe enviar al menos un género")]
        public List<int> IdsGeneros { get; set; } = new();

        [Required(ErrorMessage = "Debe enviar al menos un actor")]
        public List<int> IdsActores { get; set; } = new();
    }
}
