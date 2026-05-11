using Microsoft.AspNetCore.Mvc;
using LivrariaPIM.Data;
using LivrariaPIM.DTOs;
using LivrariaPIM.Utils;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LivrariaPIM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO login)
        {
            var cliente = _context.Clientes
                .FirstOrDefault(c => c.Email == login.Email);

            if (cliente == null)
            {
                return Unauthorized(new
                {
                    mensagem = "Email ou senha inválidos."
                });
            }

            bool senhaCorreta = HashHelper.VerificarHash(
                login.Senha,
                cliente.SenhaHash
            );

            if (!senhaCorreta)
            {
                return Unauthorized(new
                {
                    mensagem = "Email ou senha inválidos."
                });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, cliente.Email)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            var tokenGerado = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = tokenGerado
            });
        }
        [HttpPost("login-funcionario")]
        public IActionResult LoginFuncionario(LoginDTO login)
        {
            var funcionario = _context.Funcionarios
                .FirstOrDefault(f => f.Email == login.Email);

            if (funcionario == null)
            {
                return Unauthorized(new
                {
                    mensagem = "Email ou senha inválidos."
                });
            }

            bool senhaCorreta = HashHelper.VerificarHash(
                login.Senha,
                funcionario.SenhaHash
            );

            if (!senhaCorreta)
            {
                return Unauthorized(new
                {
                    mensagem = "Email ou senha inválidos."
                });
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, funcionario.Email),
                new Claim(ClaimTypes.Role, "Funcionario")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            var tokenGerado = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = tokenGerado
            });
        }
    }
}