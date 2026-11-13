using CineRepository.Data.Interfaces;
using CineRepository.Domain;
using CineRepository.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.Data.Implementations
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly CineDbContext _context;

        public ClienteRepository(CineDbContext context)
        {
            _context = context;
        }
        public async Task<LoginResponseDto?> Login(UserLoginDto user)
        {

            Cliente? c = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == user.UserEmail && c.Contraseña == user.Password);
            LoginResponseDto response = new LoginResponseDto();

            if (c == null) return null;
            

            return new LoginResponseDto()
            {
                UserId = c.IdCliente,
                UserEmail = c.Email,
                IsAdmin = c.IsAdmin
            };
        }
    }
}
