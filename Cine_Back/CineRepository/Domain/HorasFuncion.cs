using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("HorasFuncion")]
    public class HorasFuncion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idHoraFuncion")]
        public int IdHoraFuncion { get; set; }

        [Column("horaFuncion", TypeName = "time")]
        public TimeSpan HoraFuncion { get; set; }

        public virtual ICollection<PromocionHorario> PromocionesHorarios { get; set; }
            = new List<PromocionHorario>();

        public virtual ICollection<Funcion> Funciones { get; set; }
            = new List<Funcion>();
    }
}
