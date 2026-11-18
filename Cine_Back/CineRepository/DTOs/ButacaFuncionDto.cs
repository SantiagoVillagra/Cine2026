using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class ButacaFuncionDto
    {
        public int IdButaca { get; set; }
        public string Fila { get; set; } = string.Empty;
        public int Numero { get; set; }
        public bool Ocupada { get; set; }
    }
}
