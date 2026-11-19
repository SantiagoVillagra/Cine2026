using CineRepository.Data.Implementations;
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
    public class ReservaService : IReservaService
    {
        private readonly IReservaRepository _reservaRepository;
        private readonly IFacturaRepository _facturaRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReservaService(IReservaRepository reservaRepository, IUnitOfWork unitOfWork, IFacturaRepository facturaRepository) //Agregar ocupBut.
        {
            _reservaRepository = reservaRepository;
            _unitOfWork = unitOfWork;
            _facturaRepository = facturaRepository;
        }

        public async Task<bool> CancelarAsync(int idReserva, int idCliente, bool esAdmin)
        {
            Reserva? r = await _reservaRepository.GetByIdAsync(idReserva);
            if (r == null)
                throw new KeyNotFoundException("La reserva no existe.");

            if (!esAdmin && r.IdCliente != idCliente)
                throw new UnauthorizedAccessException("No tenés permisos para cancelar esta reserva.");

            if (!r.Estado) //Si es false ya está cancelada
                throw new InvalidOperationException("La reserva ya se encuentra cancelada.");

            if (r.Facturas.Any()) //Si ya está facturada
                throw new InvalidOperationException("No se puede cancelar una reserva facturada.");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                await _reservaRepository.DeleteByReservaAsync(idReserva);

                r.Estado = false;

                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitAsync();
                return true;
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackAsync();

                throw;
            }
        }

        public async Task<Factura> ConfirmarAsync(int idReserva, int idCliente, bool esAdmin, ConfirmarReservaDto dto)
        {
            Reserva? r = await _reservaRepository.GetByIdAsync(idReserva);
            if (r == null)
                throw new KeyNotFoundException("La reserva no existe.");

            if (!esAdmin && r.IdCliente != idCliente)
                throw new UnauthorizedAccessException("No tenés permisos para confirmar esta reserva.");

            if (!r.Estado) //Si es false ya está cancelada
                throw new InvalidOperationException("No se puede confirmar una reserva ya cancelada.");

            if (r.Facturas.Any()) //Si ya está facturada
                throw new InvalidOperationException("Esta reserva ya ha sido confirmada.");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                List<DetalleFactura> detalles = new List<DetalleFactura>();
                foreach (DetalleReserva dr in r.DetallesReservas)
                {
                    DetalleFactura det = new DetalleFactura()
                    {
                        PrecioUnitario = dr.Precio,
                        IdPromocion = dr.IdPromocion,
                        IdFuncion = dr.IdFuncion,
                        IdButaca = dr.IdButaca,
                        IdDetalleReserva = dr.IdDetalleReserva,
                        IdTipoEntrada = dr.IdTipoEntrada,
                    };

                    detalles.Add(det);
                }

                Factura f = new Factura()
                {
                    FechaHoraEmision = DateTime.Now,
                    IdReserva = r.IdReserva,
                    IdCliente = r.IdCliente,
                    IdFormaPago = dto.IdFormaPago,
                    IdCanalVenta = dto.IdCanalVenta,
                    DetallesFacturas = detalles
                };
                await _facturaRepository.PostVentaPorReservaAsync(f); //Crear la factura

                await _unitOfWork.SaveChangesAsync();

                await _reservaRepository.UpdateOcupWithFacturaAsync(idReserva, f.DetallesFacturas.ToList()); //Completar la column idDetalleFc en Ocp.But.}

                r.FechaHoraConfirmacion = DateTime.Now;

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

        public async Task<Reserva> CrearReservaAsync(int idCliente, PostReservaDto detallesDto)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                List<DetalleReserva> detalles = new List<DetalleReserva>();
                foreach (DetalleReservaDto drDto in detallesDto.Detalles)
                {
                    //Chequear si la butaca es de la sala de la función:
                    bool pertenece = await _reservaRepository.ButacaPerteneceAFuncionAsync(drDto.IdFuncion, drDto.IdButaca);

                    if (!pertenece)
                        throw new InvalidOperationException($"La butaca {drDto.IdButaca} no pertenece a la sala de la función {drDto.IdFuncion}.");

                    //Chequear quela butaca no esté reservada:
                    bool disponible = await _reservaRepository.ButacaDisponibleAsync(drDto.IdFuncion, drDto.IdButaca);

                    if(!disponible)
                        throw new InvalidOperationException($"La butaca {drDto.IdButaca} ya está ocupada para la función {drDto.IdFuncion}.");

                    DetalleReserva det = new DetalleReserva() {
                        IdFuncion = drDto.IdFuncion,
                        IdButaca = drDto.IdButaca,
                        IdTipoEntrada = drDto.IdTipoEntrada,
                        Precio = drDto.Precio, //CON ID FUNCION -> IDSALA -> PRECIO -> CON IDTIPOENTRADA DESC. DE ENTRADA
                        IdPromocion = drDto.IdPromocion == 0 ? null : drDto.IdPromocion //CON IDFUNCION -> FECHA Y IDHORA -> 
                    };

                    detalles.Add(det);
                }

                Reserva r = new Reserva()
                {
                    FechaHoraReserva = DateTime.Now,
                    IdCliente = idCliente,
                    Estado = true, //false es cuando se cancela la reserva
                    DetallesReservas = detalles
                };

                await _reservaRepository.PostReservaAsync(r); //recuperar la reserva

                await _unitOfWork.SaveChangesAsync();

                //CREAR LA OCUPACIONDE BUTACAS:
                                
                List<OcupacionButaca> lstOcupacion = new List<OcupacionButaca>();
                foreach (DetalleReserva dr in r.DetallesReservas)
                {
                    OcupacionButaca ob = new OcupacionButaca()
                    {
                        IdFuncion = dr.IdFuncion,
                        IdButaca = dr.IdButaca,
                        IdDetalleReserva = dr.IdDetalleReserva
                    };
                    lstOcupacion.Add(ob);
                }
                await _reservaRepository.PostOcupByReservaAsync(lstOcupacion);

                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitAsync();
                return r;
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<List<Reserva>> TraerMisReservasAsync(int idCliente)
        {
            return await _reservaRepository.GetMisReservasAsync(idCliente);
        }

        public async Task<Reserva?> TraerPorIdAsync(int idReserva, int idCliente, bool esAdmin)
        {
            Reserva? r = await _reservaRepository.GetByIdAsync(idReserva);

            if (r == null)
                return null;

            if (!esAdmin && r.IdCliente != idCliente)
                return null;

            return r;
        }

        public async Task<List<Reserva>> TraerTodasAsync()
        {
            return await _reservaRepository.GetAllAsync();
        }
    }
}
