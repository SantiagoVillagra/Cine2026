using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("TiposSala")]
    public class TipoSala
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idTipoSala")]
        public int IdTipoSala { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("descripcion", TypeName = "varchar(50)")]
        public string Descripcion { get; set; } = string.Empty;

        [Column("precio", TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        public virtual ICollection<Sala> Salas { get; set; } = new List<Sala>();
    }
}
