using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("CanalesVenta")]
    public class CanalVenta
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idCanalVenta")]
        public int IdCanalVenta { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("descripcion", TypeName = "varchar(50)")]
        public string Descripcion { get; set; } = string.Empty;

        public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    }
}
