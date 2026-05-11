using System.Security.Cryptography;
using System.Text;

namespace LivrariaPIM.Utils
{
    public class HashHelper
    {
        public static string GerarHash(string senha)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(senha));

                StringBuilder builder = new StringBuilder();
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }

                return builder.ToString();
            }
        }
        public static bool VerificarHash(string senha, string hash)
        {
            var senhaHash = GerarHash(senha);

            return senhaHash == hash;
        }
    }
}