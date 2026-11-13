using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("FormasPago")]
    public class FormaPago
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idFormaPago")]
        public int IdFormaPago { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("descripcion", TypeName = "varchar(50)")]
        public string Descripcion { get; set; } = string.Empty;

        public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    }
}
