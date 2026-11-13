using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CineRepository.DTOs
{
    public class LoginResponseDto
    {
        public int UserId { get; set; }
        public string? UserEmail { get; set; }
        public bool IsAdmin { get; set; }
    }
}
