using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("PromocionesHorarios")]
    public class PromocionHorario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idPromocionHorario")]
        public int IdPromocionHorario { get; set; }

        [Column("idHoraFuncion")]
        public int IdHoraFuncion { get; set; }

        [Column("idPromocion")]
        public int IdPromocion { get; set; }

        [ForeignKey(nameof(IdHoraFuncion))]
        [JsonIgnore]
        public virtual HorasFuncion? HorasFuncion { get; set; }

        [ForeignKey(nameof(IdPromocion))]
        [JsonIgnore]
        public virtual Promocion? Promocion { get; set; }
    }
}
