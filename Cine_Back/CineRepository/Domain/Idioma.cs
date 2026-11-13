using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Idiomas")]
    public class Idioma
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idIdioma")]
        public int IdIdioma { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("descripcion", TypeName = "varchar(50)")]
        public string Descripcion { get; set; } = string.Empty;

        public virtual ICollection<Funcion> Funciones { get; set; } = new List<Funcion>();
    }
}
