// utils.js
// Funções que uso em vários arquivos do projeto.
// Nenhuma dependência externa, pode importar sem medo.

// Formata qualquer número como moeda BRL (ex: 79.9 → R$ 79,90)
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// Tira todos os acentos de um texto
// Ex: "Programação" → "Programacao"
function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Normaliza o texto pra comparação: sem acento, tudo minúsculo e sem espaço sobrando
// Uso bastante nos filtros e na pesquisa
function textoNormalizado(texto) {
  return removerAcentos(texto).toLowerCase().trim();
}

// Gera um slug/ID a partir de um título
// Ex: "Clean Code" → "clean-code" / "O Hobbit" → "o-hobbit"
function criarId(titulo) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Converte um preço em texto pra número de verdade
// Ex: "R$ 79,90" → 79.9
function textoParaPreco(texto) {
  return Number(
    texto
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
}

// Gera uma chave de categoria sem hífens, boa pra comparar strings
// Ex: "Front-end" → "frontend"
function chaveCategoria(texto) {
  return criarId(texto).replace(/-/g, "");
}

// Escapa caracteres especiais do HTML pra evitar XSS
// Sempre usar quando jogar texto do usuário no innerHTML
function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Mostra uma mensagem flutuante na tela (tipo toast).
// Aparece, fica 2.6s e some sozinha.
// Passa "sucesso" como tipo pra usar a variante verde, deixando bem visível.
function mostrarMensagem(texto, tipo) {
  // Remove qualquer mensagem anterior que ainda esteja na tela
  const mensagemAntiga = document.querySelector(".mensagem-carrinho");
  mensagemAntiga?.remove();

  const mensagem = document.createElement("div");
  mensagem.className = tipo ? `mensagem-carrinho ${tipo}` : "mensagem-carrinho";
  mensagem.textContent = texto;
  document.body.appendChild(mensagem);

  // Pequeno delay pra o CSS de transição funcionar direito
  setTimeout(() => mensagem.classList.add("visivel"), 10);

  setTimeout(() => {
    mensagem.classList.remove("visivel");
    setTimeout(() => mensagem.remove(), 250);
  }, 2600);
}


// ── Menu mobile hamburguer ────────────────────────────────────────
// Abre/fecha o menu de navegação no mobile ao clicar no hamburguer.
// Também fecha o menu se clicar fora dele.
document.addEventListener("DOMContentLoaded", function () {
  const btn  = document.getElementById("btn-hamburguer");
  const nav  = document.getElementById("menu-navegacao");
  const acoes = document.querySelector(".acoes-navbar");
  if (!btn || !nav) return;

  function abrirMenu() {
    const aberto = btn.classList.toggle("aberto");
    btn.setAttribute("aria-expanded", aberto);
    nav.classList.toggle("menu-aberto", aberto);
    acoes?.classList.toggle("menu-aberto", aberto);
  }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    abrirMenu();
  });

  // Fecha ao clicar em qualquer link do menu
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      btn.classList.remove("aberto");
      btn.setAttribute("aria-expanded", "false");
      nav.classList.remove("menu-aberto");
      acoes?.classList.remove("menu-aberto");
    });
  });

  // Fecha ao clicar fora
  document.addEventListener("click", function (e) {
    if (!btn.contains(e.target) && !nav.contains(e.target)) {
      btn.classList.remove("aberto");
      btn.setAttribute("aria-expanded", "false");
      nav.classList.remove("menu-aberto");
      acoes?.classList.remove("menu-aberto");
    }
  });
});
