// livros.js
// Cuida dos cards de livros, filtros do catálogo e links de categoria.
// Depende de: utils.js, catalogo.js

// ── Cards ─────────────────────────────────────────────────────────

// Configura cada card pra funcionar como link pra página do livro.
// Também adiciona o botão "Ver detalhes" caso ainda não exista no card.
function configurarCardsLivros() {
  document.querySelectorAll(".card-livro").forEach((card) => {
    const titulo      = card.querySelector("h3")?.textContent.trim();
    const livro       = titulo ? buscarLivroPorTitulo(titulo) : null;
    const urlDetalhes = livro ? `livro.html?id=${livro.id}` : "livro.html";

    card.dataset.livroId = livro?.id || "";

    // Atualiza qualquer link genérico de "livro.html" que já exista no card
    card.querySelectorAll("a[href='livro.html']").forEach((link) => {
      link.href = urlDetalhes;
    });

    // Se o card não tiver o botão "Ver detalhes", cria e adiciona
    if (!card.querySelector(".link-detalhes-livro")) {
      const linkDetalhes = document.createElement("a");
      linkDetalhes.className   = "link-detalhes-livro";
      linkDetalhes.href        = urlDetalhes;
      linkDetalhes.textContent = "Ver detalhes";
      linkDetalhes.setAttribute("aria-label", "Ver detalhes do livro");
      card.appendChild(linkDetalhes);
    } else {
      card.querySelector(".link-detalhes-livro").href = urlDetalhes;
    }

    // Clicar em qualquer parte do card (fora de link ou botão) também navega
    card.addEventListener("click", (evento) => {
      if (evento.target.closest("button, a")) return;
      window.location.href = urlDetalhes;
    });
  });
}

// ── Filtros ───────────────────────────────────────────────────────

// Configura os botões de filtro por categoria em livros.html.
// Se a URL tiver ?categoria=..., já aplica o filtro automaticamente ao carregar.
function configurarFiltrosLivros() {
  const filtros = document.querySelector(".filtros-livros");
  const grade   = document.querySelector(".catalogo-livros");
  if (!filtros || !grade) return;

  // Cria a mensagem de "nenhum livro encontrado" caso não exista
  let mensagemVazia = grade.querySelector(".mensagem-filtro-vazio");
  if (!mensagemVazia) {
    mensagemVazia = document.createElement("p");
    mensagemVazia.className   = "mensagem-filtro-vazio oculto";
    mensagemVazia.textContent = "Nenhum livro encontrado nessa categoria.";
    grade.appendChild(mensagemVazia);
  }

  // Filtra os cards pelo botão clicado
  const aplicarFiltro = (botao) => {
    const categoriaSelecionada = textoNormalizado(botao.textContent);
    const chaveSelecionada     = chaveCategoria(botao.textContent);
    let totalVisivel = 0;

    // Marca o botão clicado como ativo e tira dos outros
    filtros.querySelectorAll("button").forEach((item) => item.classList.remove("ativo"));
    botao.classList.add("ativo");

    // Mostra ou esconde cada card dependendo se bate com a categoria
    grade.querySelectorAll(".card-livro").forEach((card) => {
      const categoriaTexto = card.querySelector(".categoria-livro")?.textContent || "";
      const categoriaCard  = textoNormalizado(categoriaTexto);

      const deveMostrar =
        categoriaSelecionada === "todos" ||
        categoriaCard === categoriaSelecionada ||
        chaveCategoria(categoriaTexto) === chaveSelecionada;

      card.classList.toggle("oculto", !deveMostrar);
      if (deveMostrar) totalVisivel += 1;
    });

    mensagemVazia.classList.toggle("oculto", totalVisivel > 0);
  };

  // Registra o clique em cada botão de filtro
  filtros.querySelectorAll("button").forEach((botao) => {
    botao.addEventListener("click", () => aplicarFiltro(botao));
  });

  // Se a URL tiver ?categoria=programacao (por exemplo), aplica o filtro já na abertura
  const categoriaUrl = new URLSearchParams(window.location.search).get("categoria");
  if (categoriaUrl) {
    const chaveUrl     = chaveCategoria(categoriaUrl);
    const botaoInicial = Array.from(filtros.querySelectorAll("button"))
      .find((botao) => chaveCategoria(botao.textContent) === chaveUrl);

    if (botaoInicial) aplicarFiltro(botaoInicial);
  }
}

// ── Links de categorias ───────────────────────────────────────────

// Atualiza os links das categorias e coleções pra apontar pra livros.html
// com o filtro correto na URL. Roda em categorias.html e index.html.
function atualizarLinksCategorias() {
  // Links de categoria individual na página categorias.html
  document.querySelectorAll(".categoria-detalhada").forEach((link) => {
    const categoria = link.querySelector("h2")?.textContent.trim();
    if (categoria) {
      link.href = `livros.html?categoria=${encodeURIComponent(criarId(categoria))}`;
    }
  });

  // Cards de coleção na home (ex: "Para começar em programação")
  document.querySelectorAll(".colecao-card").forEach((card) => {
    const titulo = textoNormalizado(card.querySelector("h3")?.textContent || "");
    const link   = card.querySelector("a");
    if (!link) return;

    if (titulo.includes("programacao"))       link.href = "livros.html?categoria=programacao";
    else if (titulo.includes("classicos"))    link.href = "livros.html?categoria=ficcao";
    else if (titulo.includes("produtividade")) link.href = "livros.html?categoria=produtividade";
  });
}

// ── Formulários ───────────────────────────────────────────────────

// Valida e processa o formulário de contato.
// Login e cadastro são tratados pelo login-page.js pra não ter handler duplicado.
function configurarFormularios() {
  document.querySelectorAll(".formulario-contato").forEach((formulario) => {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      // Validação nativa do HTML antes de qualquer coisa
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }

      const senha          = formulario.querySelector("#senha-cadastro");
      const confirmarSenha = formulario.querySelector("#confirmar-senha");

      // Se tiver campo de confirmar senha, checa se bate
      if (senha && confirmarSenha && senha.value !== confirmarSenha.value) {
        confirmarSenha.setCustomValidity("As senhas precisam ser iguais.");
        confirmarSenha.reportValidity();
        confirmarSenha.setCustomValidity("");
        return;
      }

      formulario.reset();
      mostrarMensagem("Dados enviados com sucesso.");
    });
  });
}
