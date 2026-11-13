using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("TiposEntrada")]
    public class TipoEntrada
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idTipoEntrada")]
        public int IdTipoEntrada { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("descripcion", TypeName = "varchar(50)")]
        public string Descripcion { get; set; } = string.Empty;

        public virtual ICollection<DetalleReserva> DetallesReservas { get; set; }
            = new List<DetalleReserva>();

        public virtual ICollection<DetalleFactura> DetallesFacturas { get; set; }
            = new List<DetalleFactura>();
    }
}
