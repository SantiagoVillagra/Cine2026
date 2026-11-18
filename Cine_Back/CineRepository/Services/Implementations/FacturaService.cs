//using CineRepository.Data.Interfaces;
//using CineRepository.Domain;
//using CineRepository.DTOs;
//using CineRepository.Services.Interfaces;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace CineRepository.Services.Implementations
//{
//    public class FacturaService : IFacturaService
//    {
//        private readonly IFacturaRepository _facturaRepository;
//        private readonly IUnitOfWork _unitOfWork;

//        public FacturaService(IFacturaRepository facturaRepository, IUnitOfWork unitOfWork)
//        {
//            _facturaRepository = facturaRepository;
//            _unitOfWork = unitOfWork;
//        }
//        public async Task<Factura?> CrearVentaDirectaAsync(PostFacturaDto factura)
//        {
//            await _unitOfWork.BeginTransactionAsync();

//            try
//            {
//                List<DetalleFactura> detalles = new List<DetalleFactura>();
//                foreach (DetalleReservaDto drDto in factura.Detalles)
//                {
//                    DetalleFactura det = new DetalleFactura()
//                    {
//                        IdFuncion = drDto.IdFuncion,
//                        IdButaca = drDto.IdButaca,
//                        IdTipoEntrada = drDto.IdTipoEntrada,
//                        //PrecioUnitario = await _reservaRepository.GetPrecioDetall(sp_precioDetalle), //CON ID FUNCION -> IDSALA -> PRECIO -> CON IDTIPOENTRADA DESC. DE ENTRADA
//                        //IdPromocion = await _reservaRepository.GetPromoDetalle(sp_promoDetalle) //CON IDFUNCION -> FECHA Y IDHORA -> 
//                    };

//                    detalles.Add(det);
//                }

//                Factura f = new Factura()
//                {
//                    FechaHoraEmision = DateTime.Now,
//                    IdCliente = factura.IdCliente,
//                    IdFormaPago = factura.IdFormaPago,
//                    IdCanalVenta = factura.IdCanalVenta,
//                    DetallesFacturas = detalles
//                };
//                Factura fcCreada = await _facturaRepository.PostVentaDirectaAsync(f); //Crear la factura

//                //CREAR LA OCUPACIONDE BUTACAS:

//                //
//                List<OcupacionButaca> lstOcupacion = new List<OcupacionButaca>();
//                foreach (DetalleFactura df in fcCreada.DetallesFacturas)
//                {
//                    OcupacionButaca ob = new OcupacionButaca()
//                    {
//                        IdFuncion = df.IdFuncion,
//                        IdButaca = df.IdButaca,
//                        IdDetalleFactura = df.IdDetalleFactura
//                    };
//                    lstOcupacion.Add(ob);
//                }
//                //await _ocupacionRepository.PostByReservaAsync(ob);
//                /*
//                 await _context.OcupacionesButacas.AddRange(ob);
//                */

//                await _unitOfWork.SaveChangesAsync();

//                await _unitOfWork.CommitAsync();
//            }
//            catch
//            {
//                await _unitOfWork.RollbackAsync();
//                throw;
//            }
//            return await _facturaRepository.PostVentaDirectaAsync(factura);
//        }

//        public async Task<Factura?> CrearVentaPorReservaAsync(Factura factura)
//        {
//            return await _facturaRepository.PostVentaPorReservaAsync(factura);
//        }

//        public async Task<Factura?> TraerPorIdAsync(int idFactura, int idCliente, bool esAdmin)
//        {
//            Factura? f = await _facturaRepository.GetByIdAsync(idFactura);

//            if (f == null)
//                return null;

//            if (!esAdmin && f.IdCliente != idCliente)
//                return null;

//            return f;
//        }
//    }
//}
