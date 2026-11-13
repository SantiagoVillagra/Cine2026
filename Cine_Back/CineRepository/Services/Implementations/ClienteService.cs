using CineRepository.Data.Interfaces;
using CineRepository.Services.Interfaces;
using CineRepository.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Services.Implementations
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _clienteRepository;

        public ClienteService(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }
        public async Task<LoginResponseDto?> Login(UserLoginDto user)
        {
            return await _clienteRepository.Login(user);
        }
    }
}
