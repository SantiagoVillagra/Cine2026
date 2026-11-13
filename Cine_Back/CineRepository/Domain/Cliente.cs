using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CineRepository.Domain
{
    [Table("Clientes")]
    public class Cliente
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idCliente")]
        public int IdCliente { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre", TypeName = "varchar(100)")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("apellido", TypeName = "varchar(100)")]
        public string Apellido { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("dni", TypeName = "varchar(20)")]
        public string Dni { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        [Column("email", TypeName = "varchar(150)")]
        public string Email { get; set; } = string.Empty;

        [MaxLength(30)]
        [Column("telefono", TypeName = "varchar(30)")]
        public string? Telefono { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("contraseña", TypeName = "varchar(255)")]
        public string Contraseña { get; set; } = string.Empty;

        [Required]
        [Column("esAdmin", TypeName = "bit")]
        public bool IsAdmin { get; set; } = false;

        // Navegaciones
        public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();

        public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    }
}
