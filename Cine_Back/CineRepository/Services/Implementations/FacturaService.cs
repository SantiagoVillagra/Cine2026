using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using CineRepository.DTOs;
using CineRepository.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Implementations
{
    public class FacturaService : IFacturaService
    {
        private readonly IFacturaRepository _facturaRepository;
        private readonly IReservaRepository _reservaRepository;
        private readonly IUnitOfWork _unitOfWork;

        public FacturaService(IFacturaRepository facturaRepository, IReservaRepository reservaRepository, IUnitOfWork unitOfWork)
        {
            _facturaRepository = facturaRepository;
            _reservaRepository = reservaRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<Factura> CrearVentaDirectaAsync(PostFacturaDto factura)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                List<DetalleFactura> detalles = new List<DetalleFactura>();
                foreach (DetalleReservaDto drDto in factura.Detalles)
                {
                    //Chequear si la butaca es de la sala de la función:
                    bool pertenece = await _reservaRepository.ButacaPerteneceAFuncionAsync(drDto.IdFuncion, drDto.IdButaca);

                    if (!pertenece)
                        throw new InvalidOperationException($"La butaca {drDto.IdButaca} no pertenece a la sala de la función {drDto.IdFuncion}.");

                    //Chequear quela butaca no esté reservada:
                    bool disponible = await _reservaRepository.ButacaDisponibleAsync(drDto.IdFuncion, drDto.IdButaca);

                    if (!disponible)
                        throw new InvalidOperationException($"La butaca {drDto.IdButaca} ya está ocupada para la función {drDto.IdFuncion}.");

                    DetalleFactura det = new DetalleFactura()
                    {
                        IdFuncion = drDto.IdFuncion,
                        IdButaca = drDto.IdButaca,
                        IdTipoEntrada = drDto.IdTipoEntrada,
                        PrecioUnitario = drDto.Precio, //CON ID FUNCION -> IDSALA -> PRECIO -> CON IDTIPOENTRADA DESC. DE ENTRADA
                        IdPromocion = drDto.IdPromocion == 0 ? null : drDto.IdPromocion //CON IDFUNCION -> FECHA Y IDHORA -> 
                    };

                    detalles.Add(det);
                }

                Factura f = new Factura()
                {
                    FechaHoraEmision = DateTime.Now,
                    IdCliente = factura.IdCliente,
                    IdFormaPago = factura.IdFormaPago,
                    IdCanalVenta = factura.IdCanalVenta,
                    IdReserva = null,
                    DetallesFacturas = detalles
                };
                await _facturaRepository.PostVentaDirectaAsync(f); //Crear la factura

                await _unitOfWork.SaveChangesAsync();

                List<OcupacionButaca> lstOcupacion = new List<OcupacionButaca>();
                foreach (DetalleFactura df in f.DetallesFacturas)
                {
                    OcupacionButaca ob = new OcupacionButaca()
                    {
                        IdFuncion = df.IdFuncion,
                        IdButaca = df.IdButaca,
                        IdDetalleFactura = df.IdDetalleFactura,
                        IdDetalleReserva = null
                    };
                    lstOcupacion.Add(ob);
                }
                await _reservaRepository.PostOcupByReservaAsync(lstOcupacion);
                
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitAsync();

                return f;
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task CrearVentaPorReservaAsync(Factura factura)
        {
            await _facturaRepository.PostVentaPorReservaAsync(factura);
        }

        //public async Task<Factura?> TraerPorIdAsync(int idFactura, int idCliente, bool esAdmin)
        //{
        //    Factura? f = await _facturaRepository.GetByIdAsync(idFactura);

        //    if (f == null)
        //        return null;

        //    if (!esAdmin && f.IdCliente != idCliente)
        //        return null;

        //    return f;
        //}

        public async Task<FacturaResponseDto?> TraerPorIdAsync(int idFactura, int idCliente, bool esAdmin)
        {
            Factura? f = await _facturaRepository.GetByIdAsync(idFactura);

            if (f == null)
                return null;

            if (!esAdmin && f.IdCliente != idCliente)
                return null;

            return ToDto(f);
        }
        //public async Task<List<Factura>> TraerTodasAsync()
        //{
        //    return await _facturaRepository.GetAllAsync();
        //}

        public async Task<List<FacturaResponseDto>> TraerTodasAsync()
        {
            List<Factura> facturas = await _facturaRepository.GetAllAsync();
            return facturas.Select(ToDto).ToList();
        }
        //public async Task<List<Factura>> TraerMisFacturasAsync(int idCliente)
        //{
        //    return await _facturaRepository.GetMisFacturasAsync(idCliente);
        //}

        public async Task<List<FacturaResponseDto>> TraerMisFacturasAsync(int idCliente)
        {
            List<Factura> facturas = await _facturaRepository.GetMisFacturasAsync(idCliente);
            return facturas.Select(ToDto).ToList();
        }

        private static FacturaResponseDto ToDto(Factura f)
        {
            return new FacturaResponseDto
            {
                IdFactura = f.IdFactura,
                FechaHoraEmision = f.FechaHoraEmision,
                IdReserva = f.IdReserva,
                IdCliente = f.IdCliente,
                IdFormaPago = f.IdFormaPago,
                IdCanalVenta = f.IdCanalVenta,
                NombreCliente = f.Cliente == null
                    ? string.Empty
                    : $"{f.Cliente.Nombre} {f.Cliente.Apellido}".Trim(),
                PrecioTotal = f.DetallesFacturas.Sum(df => df.PrecioUnitario),
                DetallesFacturas = f.DetallesFacturas.Select(df => new DetalleFacturaResponseDto
                {
                    IdDetalleFactura = df.IdDetalleFactura,
                    PrecioUnitario = df.PrecioUnitario,
                    IdFactura = df.IdFactura,
                    IdFuncion = df.IdFuncion,
                    IdPromocion = df.IdPromocion,
                    IdButaca = df.IdButaca,
                    Fila = df.Butaca?.Fila ?? string.Empty,
                    NumeroButaca = df.Butaca?.Numero ?? 0,
                    IdDetalleReserva = df.IdDetalleReserva,
                    IdTipoEntrada = df.IdTipoEntrada,
                    Pelicula = df.Funcion?.Pelicula?.Titulo ?? string.Empty,
                    Fecha = df.Funcion?.Fecha.Date ?? default,
                    Hora = df.Funcion?.HorasFuncion?.HoraFuncion ?? default
                }).ToList()
            };
        }
    }
}
