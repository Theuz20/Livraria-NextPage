// esqueci-senha.js
// Cuida de toda a lógica da página de recuperação de senha.
// Valida o email, simula o envio e mostra a tela de confirmação.

document.addEventListener("DOMContentLoaded", function () {
  const form             = document.getElementById("form-esqueci-senha");
  const estadoFormulario = document.getElementById("estado-formulario");
  const estadoConfirmacao = document.getElementById("estado-confirmacao");
  const textoConfirmacao = document.getElementById("texto-confirmacao");
  const btnReenviar      = document.getElementById("btn-reenviar");
  const btnEnviar        = document.getElementById("btn-enviar");

  // Só roda nessa página
  if (!form) return;

  // Guarda o email digitado pra usar na mensagem de confirmação
  let emailDigitado = "";

  // Envia o formulário: valida, simula loading e mostra confirmação
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const input = document.getElementById("email-recuperacao");
    emailDigitado = input.value.trim();

    // Valida o email antes de qualquer coisa
    if (!emailEhValido(emailDigitado)) {
      input.setCustomValidity("Digite um e-mail válido, como nome@dominio.com.");
      input.reportValidity();
      input.setCustomValidity("");
      return;
    }

    // Simula o estado de carregando no botão
    btnEnviar.textContent = "Enviando...";
    btnEnviar.disabled = true;

    // Simula o tempo de resposta do servidor (1.2s)
    setTimeout(function () {
      mostrarConfirmacao(emailDigitado);
    }, 1200);
  });

  // Mostra a tela de confirmação com o email que foi usado
  // e dispara o toast verde pra deixar claro que funcionou
  function mostrarConfirmacao(email) {
    textoConfirmacao.textContent =
      `Enviamos as instruções pra redefinir a senha para ${email}. Verifique sua caixa de entrada e também a pasta de spam.`;

    estadoFormulario.classList.add("oculto");
    estadoConfirmacao.classList.remove("oculto");

    // Reseta o botão por garantia
    btnEnviar.textContent = "Enviar instruções";
    btnEnviar.disabled = false;

    // Toast verde bem visível — diferente da cor de fundo da página
    mostrarMensagem("E-mail enviado com sucesso! ✓", "sucesso");
  }

  // Botão "Não recebi o e-mail" — volta pro formulário e avisa que reenviou
  let tentativas = 0;
  btnReenviar.addEventListener("click", function () {
    tentativas++;

    estadoConfirmacao.classList.add("oculto");
    estadoFormulario.classList.remove("oculto");

    // Preenche o campo com o email anterior pra facilitar
    const input = document.getElementById("email-recuperacao");
    if (input && emailDigitado) input.value = emailDigitado;

    // Depois de 2 tentativas, sugere verificar o spam ou entrar em contato
    if (tentativas >= 2) {
      mostrarAvisoSenha("Verifique a pasta de spam ou entre em contato com o suporte.", "aviso");
    } else {
      mostrarAvisoSenha("Confirme o e-mail e tente novamente.", "info");
    }
  });

  // Exibe um aviso inline dentro do painel, visível em qualquer tema de cor.
  // tipo: "info" (azul) | "aviso" (amarelo)
  function mostrarAvisoSenha(texto, tipo) {
    const avisoAntigo = document.getElementById("aviso-senha-inline");
    avisoAntigo?.remove();

    const aviso = document.createElement("div");
    aviso.id = "aviso-senha-inline";
    aviso.className = "aviso-senha-inline aviso-senha--" + (tipo || "info");
    aviso.setAttribute("role", "alert");

    const icone = tipo === "aviso" ? "⚠️" : "ℹ️";
    aviso.innerHTML = `<span class="aviso-senha-icone" aria-hidden="true">${icone}</span><span>${texto}</span>`;

    // Insere logo abaixo do campo de email, antes do botão
    const formulario = document.getElementById("form-esqueci-senha");
    if (formulario) {
      formulario.insertAdjacentElement("afterend", aviso);
    } else {
      document.getElementById("estado-formulario")?.appendChild(aviso);
    }

    // Remove automaticamente após 6 segundos
    setTimeout(() => aviso?.remove(), 6000);
  }

  // Limpa a validação customizada enquanto o usuário digita
  const inputEmail = document.getElementById("email-recuperacao");
  if (inputEmail) {
    inputEmail.addEventListener("input", function () {
      inputEmail.setCustomValidity("");
    });
  }
});
