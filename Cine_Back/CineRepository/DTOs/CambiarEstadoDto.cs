using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class CambiarEstadoDto
    {
        [Required(ErrorMessage = "El campo 'activa' es obligatorio")]
        public bool? Activa { get; set; }
    }
}
