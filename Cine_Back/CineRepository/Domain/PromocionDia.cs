using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("PromocionesDias")]
    public class PromocionDia
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idPromocionDia")]
        public int IdPromocionDia { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("diaSemana", TypeName = "varchar(20)")]
        public string DiaSemana { get; set; } = string.Empty;

        [Column("idPromocion")]
        public int IdPromocion { get; set; }

        [ForeignKey(nameof(IdPromocion))]
        [JsonIgnore]
        public virtual Promocion? Promocion { get; set; }
    }
}
