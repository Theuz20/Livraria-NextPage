// login-page.js
// Lógica específica das páginas de login e cadastro.
// Depende de auth.js (carregado antes).

document.addEventListener("DOMContentLoaded", () => {
  configurarLoginForm();
  configurarCadastroForm();
  verificarRedirectLogin();
});

function verificarRedirectLogin() {
  // Se já está logado, redireciona para conta ou para a página de origem
  if (estaLogado()) {
    const params = new URLSearchParams(window.location.search);
    const destino = params.get("redirect") || "minha-conta.html";
    window.location.href = destino;
  }
}

function configurarLoginForm() {
  const form = document.querySelector(".pagina-login .formulario-acesso");
  if (!form) return;

  // Verifica se é a página de login (tem campo email-login)
  const emailInput = form.querySelector("#email-login");
  if (!emailInput) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email = emailInput.value.trim();
    const senha = form.querySelector("#senha-login")?.value || "";
    const lembrar = form.querySelector("input[type='checkbox']")?.checked || false;

    const sucesso = tentarLogin(email, senha, lembrar);

    if (sucesso) {
      mostrarMensagem("Login realizado com sucesso! ✓");
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const destino = params.get("redirect") || "minha-conta.html";
        window.location.href = destino;
      }, 800);
    } else {
      mostrarMensagem("E-mail ou senha incorretos.");
      const senhaInput = form.querySelector("#senha-login");
      if (senhaInput) {
        senhaInput.value = "";
        senhaInput.focus();
      }
    }
  });
}

function configurarCadastroForm() {
  const form = document.querySelector(".pagina-login .formulario-acesso");
  if (!form) return;

  // Verifica se é a página de cadastro (tem campo nome-cadastro)
  const nomeInput = form.querySelector("#nome-cadastro");
  if (!nomeInput) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nome = nomeInput.value.trim();
    const sobrenome = form.querySelector("#sobrenome-cadastro")?.value.trim() || "";
    const email = form.querySelector("#email-cadastro")?.value.trim() || "";
    const senha = form.querySelector("#senha-cadastro")?.value || "";
    const confirmar = form.querySelector("#confirmar-senha")?.value || "";

    if (senha !== confirmar) {
      const confirmarInput = form.querySelector("#confirmar-senha");
      confirmarInput?.setCustomValidity("As senhas precisam ser iguais.");
      confirmarInput?.reportValidity();
      confirmarInput?.setCustomValidity("");
      return;
    }

    const resultado = registrarUsuario({
      nome: `${nome} ${sobrenome}`.trim(),
      email,
      senha,
    });

    if (resultado.sucesso) {
      tentarLogin(email, senha, false);
      mostrarMensagem("Conta criada com sucesso! Bem-vindo(a)! ✓");
      setTimeout(() => { window.location.href = "minha-conta.html"; }, 800);
    } else {
      mostrarMensagem(resultado.mensagem || "Erro ao criar conta.");
    }
  });
}
