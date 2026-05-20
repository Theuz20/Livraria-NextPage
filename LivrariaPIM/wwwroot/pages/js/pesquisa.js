// pesquisa.js
// Pesquisa dinâmica por título, autor e categoria.
// Em livros.html filtra os cards em tempo real.
// Em qualquer outra página, redireciona pra livros.html?q=termo.
// Depende de: utils.js (textoNormalizado)

// Decide o que fazer quando o usuário pesquisa:
// se já está em livros.html, filtra direto. Se não, redireciona.
function executarPesquisa() {
  const input = document.getElementById("campo-pesquisa");
  if (!input) return;

  const termo = input.value.trim();
  if (!termo) return;

  const nasPaginaLivros = document.querySelector(".catalogo-livros");

  if (nasPaginaLivros) {
    filtrarCards(termo);
  } else {
    // Manda o usuário pra livros.html com o termo na URL
    window.location.href = "livros.html?q=" + encodeURIComponent(termo);
  }
}

// Filtra os cards do catálogo pelo termo digitado.
// Compara com título, autor e categoria ignorando acento e maiúsculas.
// Só funciona em livros.html (onde existe .catalogo-livros).
function filtrarCards(valorBruto) {
  const grade   = document.querySelector(".catalogo-livros");
  const filtros = document.querySelector(".filtros-livros");
  if (!grade) return;

  const termo = textoNormalizado(valorBruto);
  const cards = grade.querySelectorAll(".card-livro");

  // Cria a mensagem de "nenhum resultado" se ainda não existir
  let mensagem = grade.querySelector(".mensagem-pesquisa-vazia");
  if (!mensagem) {
    mensagem = document.createElement("p");
    mensagem.className = "mensagem-pesquisa-vazia oculto";
    grade.appendChild(mensagem);
  }

  // Quando o usuário pesquisa, volta o filtro de categoria pra "Todos"
  if (filtros && termo) {
    filtros.querySelectorAll("button").forEach((b) => b.classList.remove("ativo"));
    const btnTodos = filtros.querySelector("button");
    if (btnTodos) btnTodos.classList.add("ativo");
  }

  let visiveis = 0;
  cards.forEach((card) => {
    const titulo    = textoNormalizado(card.querySelector("h3")?.textContent || "");
    const autor     = textoNormalizado(card.querySelector(".autor-livro")?.textContent || "");
    const categoria = textoNormalizado(card.querySelector(".categoria-livro")?.textContent || "");
    const bate      = !termo || titulo.includes(termo) || autor.includes(termo) || categoria.includes(termo);

    card.classList.toggle("oculto", !bate);
    if (bate) visiveis++;
  });

  // Mostra ou esconde a mensagem de resultado vazio
  if (visiveis === 0 && termo) {
    mensagem.textContent = `Nenhum resultado para "${valorBruto}". Tente outro título, autor ou categoria.`;
    mensagem.classList.remove("oculto");
  } else {
    mensagem.classList.add("oculto");
  }
}

// Quando a página livros.html abre com ?q= na URL (vindo de outro lugar),
// preenche o campo de pesquisa e já aplica o filtro automaticamente.
function aplicarPesquisaDaUrl() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (!q) return;

  const input = document.getElementById("campo-pesquisa");
  if (input) input.value = q;

  filtrarCards(q);
}

// Inicialização — registra todos os eventos da pesquisa
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("campo-pesquisa");
  const botao = document.getElementById("btn-pesquisa");

  if (input) {
    // Filtra em tempo real enquanto digita (só em livros.html)
    input.addEventListener("input", function () {
      const nasPaginaLivros = document.querySelector(".catalogo-livros");
      if (nasPaginaLivros) filtrarCards(input.value.trim());
    });

    // Enter dispara a pesquisa sem recarregar a página
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        executarPesquisa();
      }
    });

    // O X nativo do input[type=search] dispara o evento "search", não "input"
    input.addEventListener("search", function () {
      const nasPaginaLivros = document.querySelector(".catalogo-livros");
      if (nasPaginaLivros) filtrarCards(input.value.trim());
    });
  }

  // Clique no botão "Buscar"
  if (botao) {
    botao.addEventListener("click", executarPesquisa);
  }

  // Checa se veio de outra página com ?q= e aplica o filtro
  aplicarPesquisaDaUrl();
});
