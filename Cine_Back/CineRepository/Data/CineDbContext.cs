using CineRepository.Domain;
using Microsoft.EntityFrameworkCore;

namespace CineRepository.Data
{
    public class CineDbContext : DbContext
    {
        public CineDbContext(DbContextOptions<CineDbContext> options)
            : base(options)
        {
        }

        // Clientes y ventas
        public DbSet<Cliente> Clientes { get; set; } = null!;
        public DbSet<CanalVenta> CanalesVenta { get; set; } = null!;
        public DbSet<FormaPago> FormasPago { get; set; } = null!;

        // Horarios y promociones
        public DbSet<HorasFuncion> HorasFunciones { get; set; } = null!;
        public DbSet<Promocion> Promociones { get; set; } = null!;
        public DbSet<PromocionDia> PromocionesDias { get; set; } = null!;
        public DbSet<PromocionHorario> PromocionesHorarios { get; set; } = null!;
        public DbSet<TipoEntrada> TiposEntrada { get; set; } = null!;

        // Salas y butacas
        public DbSet<TipoSala> TiposSala { get; set; } = null!;
        public DbSet<Sala> Salas { get; set; } = null!;
        public DbSet<Butaca> Butacas { get; set; } = null!;

        // Películas
        public DbSet<Idioma> Idiomas { get; set; } = null!;
        public DbSet<Clasificacion> Clasificaciones { get; set; } = null!;
        public DbSet<Director> Directores { get; set; } = null!;
        public DbSet<Genero> Generos { get; set; } = null!;
        public DbSet<Actor> Actores { get; set; } = null!;
        public DbSet<Pelicula> Peliculas { get; set; } = null!;
        public DbSet<PeliculaGenero> PeliculasGeneros { get; set; } = null!;
        public DbSet<ActorPelicula> ActoresPeliculas { get; set; } = null!;

        // Funciones y reservas
        public DbSet<Funcion> Funciones { get; set; } = null!;
        public DbSet<Reserva> Reservas { get; set; } = null!;
        public DbSet<DetalleReserva> DetallesReservas { get; set; } = null!;

        // Facturación
        public DbSet<Factura> Facturas { get; set; } = null!;
        public DbSet<DetalleFactura> DetallesFacturas { get; set; } = null!;

        public DbSet<OcupacionButaca> OcupacionesButacas { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // PROMOCIONES

            modelBuilder.Entity<PromocionDia>()
                .HasOne(pd => pd.Promocion)
                .WithMany(p => p.PromocionesDias)
                .HasForeignKey(pd => pd.IdPromocion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PromocionHorario>()
                .HasOne(ph => ph.Promocion)
                .WithMany(p => p.PromocionesHorarios)
                .HasForeignKey(ph => ph.IdPromocion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PromocionHorario>()
                .HasOne(ph => ph.HorasFuncion)
                .WithMany(h => h.PromocionesHorarios)
                .HasForeignKey(ph => ph.IdHoraFuncion)
                .OnDelete(DeleteBehavior.Restrict);


            // SALAS Y BUTACAS

            modelBuilder.Entity<Sala>()
                .HasOne(s => s.TipoSala)
                .WithMany(ts => ts.Salas)
                .HasForeignKey(s => s.IdTipoSala)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Butaca>()
                .HasOne(b => b.Sala)
                .WithMany(s => s.Butacas)
                .HasForeignKey(b => b.IdSala)
                .OnDelete(DeleteBehavior.Restrict);


            // PELÍCULAS

            modelBuilder.Entity<Pelicula>()
                .HasOne(p => p.Clasificacion)
                .WithMany(c => c.Peliculas)
                .HasForeignKey(p => p.IdClasificacion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pelicula>()
                .HasOne(p => p.Director)
                .WithMany(d => d.Peliculas)
                .HasForeignKey(p => p.IdDirector)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PeliculaGenero>()
                .HasOne(pg => pg.Pelicula)
                .WithMany(p => p.PeliculasGeneros)
                .HasForeignKey(pg => pg.IdPelicula)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PeliculaGenero>()
                .HasOne(pg => pg.Genero)
                .WithMany(g => g.PeliculasGeneros)
                .HasForeignKey(pg => pg.IdGenero)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ActorPelicula>()
                .HasOne(ap => ap.Actor)
                .WithMany(a => a.ActoresPeliculas)
                .HasForeignKey(ap => ap.IdActor)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ActorPelicula>()
                .HasOne(ap => ap.Pelicula)
                .WithMany(p => p.ActoresPeliculas)
                .HasForeignKey(ap => ap.IdPelicula)
                .OnDelete(DeleteBehavior.Restrict);


            // FUNCIONES

            modelBuilder.Entity<Funcion>()
                .HasOne(f => f.HorasFuncion)
                .WithMany(h => h.Funciones)
                .HasForeignKey(f => f.IdHoraFuncion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Funcion>()
                .HasOne(f => f.Pelicula)
                .WithMany(p => p.Funciones)
                .HasForeignKey(f => f.IdPelicula)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Funcion>()
                .HasOne(f => f.Sala)
                .WithMany(s => s.Funciones)
                .HasForeignKey(f => f.IdSala)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Funcion>()
                .HasOne(f => f.Idioma)
                .WithMany(i => i.Funciones)
                .HasForeignKey(f => f.IdIdioma)
                .OnDelete(DeleteBehavior.Restrict);


            // RESERVAS

            modelBuilder.Entity<Reserva>()
                .HasOne(r => r.Cliente)
                .WithMany(c => c.Reservas)
                .HasForeignKey(r => r.IdCliente)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleReserva>()
                .HasOne(dr => dr.Reserva)
                .WithMany(r => r.DetallesReservas)
                .HasForeignKey(dr => dr.IdReserva)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleReserva>()
                .HasOne(dr => dr.Funcion)
                .WithMany(f => f.DetallesReservas)
                .HasForeignKey(dr => dr.IdFuncion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleReserva>()
                .HasOne(dr => dr.Butaca)
                .WithMany(b => b.DetallesReservas)
                .HasForeignKey(dr => dr.IdButaca)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleReserva>()
                .HasOne(dr => dr.TipoEntrada)
                .WithMany(te => te.DetallesReservas)
                .HasForeignKey(dr => dr.IdTipoEntrada)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleReserva>()
                .HasOne(dr => dr.Promocion)
                .WithMany(p => p.DetallesReservas)
                .HasForeignKey(dr => dr.IdPromocion)
                .OnDelete(DeleteBehavior.Restrict);


            // FACTURAS

            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Reserva)
                .WithMany(r => r.Facturas)
                .HasForeignKey(f => f.IdReserva)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Cliente)
                .WithMany(c => c.Facturas)
                .HasForeignKey(f => f.IdCliente)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Factura>()
                .HasOne(f => f.FormaPago)
                .WithMany(fp => fp.Facturas)
                .HasForeignKey(f => f.IdFormaPago)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Factura>()
                .HasOne(f => f.CanalVenta)
                .WithMany(cv => cv.Facturas)
                .HasForeignKey(f => f.IdCanalVenta)
                .OnDelete(DeleteBehavior.Restrict);


            // DETALLES DE FACTURA

            modelBuilder.Entity<DetalleFactura>()
                .HasOne(df => df.Factura)
                .WithMany(f => f.DetallesFacturas)
                .HasForeignKey(df => df.IdFactura)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleFactura>()
                .HasOne(df => df.Funcion)
                .WithMany(f => f.DetallesFacturas)
                .HasForeignKey(df => df.IdFuncion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleFactura>()
                .HasOne(df => df.Promocion)
                .WithMany(p => p.DetallesFacturas)
                .HasForeignKey(df => df.IdPromocion)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleFactura>()
                .HasOne(df => df.Butaca)
                .WithMany(b => b.DetallesFacturas)
                .HasForeignKey(df => df.IdButaca)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleFactura>()
                .HasOne(df => df.DetalleReserva)
                .WithMany(dr => dr.DetallesFacturas)
                .HasForeignKey(df => df.IdDetalleReserva)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DetalleFactura>()
                .HasOne(df => df.TipoEntrada)
                .WithMany(te => te.DetallesFacturas)
                .HasForeignKey(df => df.IdTipoEntrada)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OcupacionButaca>()
                .HasKey(o => new { o.IdFuncion, o.IdButaca });

            modelBuilder.Entity<OcupacionButaca>()
                .HasOne(o => o.Funcion)
                .WithMany()
                .HasForeignKey(o => o.IdFuncion);

            modelBuilder.Entity<OcupacionButaca>()
                .HasOne(o => o.Butaca)
                .WithMany()
                .HasForeignKey(o => o.IdButaca);

            modelBuilder.Entity<OcupacionButaca>()
                .HasOne(o => o.DetalleReserva)
                .WithMany()
                .HasForeignKey(o => o.IdDetalleReserva)
                .IsRequired(false);

            modelBuilder.Entity<OcupacionButaca>()
                .HasOne(o => o.DetalleFactura)
                .WithMany()
                .HasForeignKey(o => o.IdDetalleFactura)
                .IsRequired(false);

            base.OnModelCreating(modelBuilder);
        }
    }
}
