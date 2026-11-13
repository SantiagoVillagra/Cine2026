using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Butacas")]
    public class Butaca
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idButaca")]
        public int IdButaca { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("fila", TypeName = "varchar(10)")]
        public string Fila { get; set; } = string.Empty;

        [Column("numero")]
        public int Numero { get; set; }

        [Column("idSala")]
        public int IdSala { get; set; }

        [Column("reservada")]
        public bool? Reservada { get; set; }

        [ForeignKey(nameof(IdSala))]
        [JsonIgnore]
        public virtual Sala? Sala { get; set; }

        public virtual ICollection<DetalleReserva> DetallesReservas { get; set; }
            = new List<DetalleReserva>();

        public virtual ICollection<DetalleFactura> DetallesFacturas { get; set; }
            = new List<DetalleFactura>();
    }
}
