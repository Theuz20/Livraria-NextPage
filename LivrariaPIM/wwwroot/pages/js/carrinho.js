/**
 * carrinho.js — NextPage Livraria
 * ─────────────────────────────────────────────────────────────────
 * Gerenciamento do carrinho de compras: leitura, escrita,
 * cálculos, renderização e interações do usuário.
 * Depende de: utils.js, catalogo.js
 * ─────────────────────────────────────────────────────────────────
 */

// ─── Constantes ───────────────────────────────────────────────────

const CART_KEY     = "nextpage-cart";
const ORDER_KEY    = "nextpage-last-order";
const FRETE_PADRAO = 12.9;

// ─── Persistência (localStorage) ─────────────────────────────────

/**
 * Lê o carrinho salvo no localStorage.
 * @returns {Array}
 */
function lerCarrinho() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/**
 * Salva o carrinho no localStorage e atualiza o contador no header.
 * @param {Array} carrinho
 */
function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

// ─── Cálculos ─────────────────────────────────────────────────────

/**
 * Calcula subtotal, frete, desconto e total a partir do carrinho.
 * Frete grátis para compras acima de R$ 149.
 * @param {Array} carrinho
 * @returns {{ subtotal: number, frete: number, desconto: number, total: number }}
 */
function calcularTotais(carrinho) {
  const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const frete    = subtotal > 0 && subtotal < 149 ? FRETE_PADRAO : 0;
  const desconto = 0;
  const total    = subtotal + frete - desconto;
  return { subtotal, frete, desconto, total };
}

// ─── Leitura de dados do DOM ──────────────────────────────────────

/**
 * Lê os dados de produto a partir de um card de livro no DOM.
 * Prioriza o catálogo; usa fallback para dados extraídos do HTML.
 * @param {HTMLElement} botao
 * @returns {object|null}
 */
function buscarDadosDoCard(botao) {
  const card = botao.closest(".card-livro");
  if (!card) return null;

  const titulo = card.querySelector("h3")?.textContent.trim();
  const livroCatalogo = titulo ? buscarLivroPorTitulo(titulo) : null;
  if (livroCatalogo) return livroParaCarrinho(livroCatalogo);

  const autor      = card.querySelector(".autor-livro, .informacoes-livro p")?.textContent.trim() || "";
  const categoria  = card.querySelector(".categoria-livro, .categoria-card")?.textContent.trim() || "Livro";
  const precoTexto = card.querySelector(".preco-livro")?.textContent.trim();
  const imagem     = card.querySelector("img")?.getAttribute("src") || "";

  if (!titulo || !precoTexto) return null;

  return {
    id: criarId(titulo),
    titulo,
    autor,
    categoria,
    preco: textoParaPreco(precoTexto),
    imagem,
    quantidade: 1,
  };
}

/**
 * Lê os dados de produto a partir da página de detalhe do livro.
 * @param {HTMLElement} botao
 * @returns {object|null}
 */
function buscarDadosDaPaginaLivro(botao) {
  const detalhe = botao.closest(".detalhe-livro");
  if (!detalhe) return null;

  const titulo = detalhe.querySelector("h1")?.textContent.trim();
  const livroCatalogo = titulo ? buscarLivroPorTitulo(titulo) : null;
  if (livroCatalogo) return livroParaCarrinho(livroCatalogo);

  const autor      = detalhe.querySelector(".autor-detalhe")?.textContent.trim() || "";
  const categoria  = detalhe.querySelector(".categoria-livro")?.textContent.trim() || "Livro";
  const precoTexto = detalhe.querySelector(".preco-detalhe")?.textContent.trim();
  const imagem     = detalhe.querySelector("img")?.getAttribute("src") || "";

  if (!titulo || !precoTexto) return null;

  return {
    id: criarId(titulo),
    titulo,
    autor,
    categoria,
    preco: textoParaPreco(precoTexto),
    imagem,
    quantidade: 1,
  };
}

// ─── Ações do carrinho ────────────────────────────────────────────

/**
 * Adiciona um produto ao carrinho ou incrementa a quantidade se já existir.
 * @param {object} produto
 */
function adicionarAoCarrinho(produto) {
  if (!estaLogado()) {
    window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.pathname.split("/").pop());
    return;
  }

  const carrinho = lerCarrinho();
  const itemExistente = carrinho.find((item) => item.id === produto.id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push(produto);
  }

  salvarCarrinho(carrinho);
  mostrarMensagem(`${produto.titulo} foi adicionado ao carrinho.`);
}

/**
 * Altera a quantidade de um item. Remove o item se quantidade <= 0.
 * @param {string} id
 * @param {number} quantidade
 */
function alterarQuantidade(id, quantidade) {
  const carrinho = lerCarrinho()
    .map((item) => (item.id === id ? { ...item, quantidade } : item))
    .filter((item) => item.quantidade > 0);

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

/**
 * Remove um item do carrinho pelo ID.
 * @param {string} id
 */
function removerItem(id) {
  const carrinho = lerCarrinho().filter((item) => item.id !== id);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

// ─── Atualização do header ────────────────────────────────────────

/**
 * Atualiza o badge do contador de itens no botão do carrinho no header.
 */
function atualizarContadorCarrinho() {
  const totalItens = lerCarrinho().reduce((total, item) => total + item.quantidade, 0);

  document.querySelectorAll(".botao-carrinho").forEach((botao) => {
    botao.innerHTML = `
      <span class="texto-carrinho">Carrinho</span>
      ${totalItens > 0 ? `<span class="badge-carrinho">${totalItens}</span>` : ""}
    `;
  });
}

// ─── Templates HTML ───────────────────────────────────────────────

/**
 * Gera o HTML de um item do carrinho.
 * @param {object} item
 * @returns {string}
 */
function criarItemCarrinho(item) {
  return `
    <article class="item-carrinho" data-id="${item.id}">
      <a class="imagem-item" href="livro.html?id=${item.id}">
        <img src="${item.imagem}" alt="Capa do livro ${item.titulo}">
      </a>

      <div class="dados-item">
        <span class="categoria-livro">${item.categoria}</span>
        <a href="livro.html?id=${item.id}">
          <h3>${item.titulo}</h3>
        </a>
        <p>${item.autor}</p>
        <strong>Em estoque</strong>
      </div>

      <div class="controle-quantidade" aria-label="Quantidade de ${item.titulo}">
        <button type="button" data-acao="diminuir" aria-label="Diminuir quantidade">-</button>
        <span>${item.quantidade}</span>
        <button type="button" data-acao="aumentar" aria-label="Aumentar quantidade">+</button>
      </div>

      <div class="preco-item">
        <strong>${moeda.format(item.preco * item.quantidade)}</strong>
        <button type="button" data-acao="remover">Remover</button>
      </div>
    </article>
  `;
}

/**
 * Gera o HTML do estado vazio do carrinho.
 * @returns {string}
 */
function criarCarrinhoVazio() {
  return `
    <div class="carrinho-vazio">
      <h3>Seu carrinho está vazio</h3>
      <p>Escolha alguns livros no catálogo para continuar sua compra.</p>
      <a href="livros.html">Ver livros</a>
    </div>
  `;
}

/**
 * Gera o HTML do resumo de um item para o checkout.
 * @param {object} item
 * @returns {string}
 */
function criarItemResumo(item) {
  return `
    <div class="item-resumo">
      <img src="${item.imagem}" alt="Capa do livro ${item.titulo}">
      <div>
        <strong>${item.titulo}</strong>
        <span>${item.quantidade} ${item.quantidade === 1 ? "unidade" : "unidades"}</span>
      </div>
      <b>${moeda.format(item.preco * item.quantidade)}</b>
    </div>
  `;
}

// ─── Renderizações ────────────────────────────────────────────────

/**
 * Renderiza o resumo lateral do carrinho (subtotal, frete, total, botão).
 * @param {Array} carrinho
 */
function renderizarResumoCarrinho(carrinho) {
  const resumo = document.querySelector(".resumo-pedido");
  if (!resumo) return;

  const { subtotal, frete, desconto, total } = calcularTotais(carrinho);

  resumo.innerHTML = `
    <h2>Resumo do pedido</h2>

    <div class="linha-resumo">
      <span>Subtotal</span>
      <strong>${moeda.format(subtotal)}</strong>
    </div>

    <div class="linha-resumo">
      <span>Desconto</span>
      <strong>- ${moeda.format(desconto)}</strong>
    </div>

    <div class="linha-resumo">
      <span>Frete</span>
      <strong>${frete === 0 ? "Grátis" : moeda.format(frete)}</strong>
    </div>

    <div class="linha-total">
      <span>Total</span>
      <strong>${moeda.format(total)}</strong>
    </div>

    <a class="botao-finalizar ${carrinho.length === 0 ? "desabilitado" : ""}" href="checkout.html">Finalizar compra</a>

    <div class="selos-compra">
      <p>Compra segura</p>
      <p>Frete grátis acima de R$ 149</p>
      <p>Troca facilitada em até 7 dias</p>
    </div>
  `;
}

/**
 * Renderiza a lista de itens e o resumo da página do carrinho.
 * Registra os eventos de interação (aumentar, diminuir, remover).
 */
function renderizarCarrinho() {
  const lista = document.querySelector(".lista-carrinho");
  if (!lista) return;

  const carrinho  = lerCarrinho();
  const cabecalho = lista.querySelector(".cabecalho-lista");
  const opcoes    = lista.querySelector(".opcoes-carrinho");

  // Remove itens existentes antes de re-renderizar
  lista.querySelectorAll(".item-carrinho, .carrinho-vazio").forEach((el) => el.remove());

  // Atualiza contador de produtos no cabeçalho
  const totalProdutos = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const contador = cabecalho?.querySelector("span");
  if (contador) {
    contador.textContent = `${totalProdutos} ${totalProdutos === 1 ? "produto" : "produtos"}`;
  }

  // Injeta itens ou estado vazio
  const html = carrinho.length > 0
    ? carrinho.map(criarItemCarrinho).join("")
    : criarCarrinhoVazio();

  opcoes?.insertAdjacentHTML("beforebegin", html);
  opcoes?.classList.toggle("oculto", carrinho.length === 0);

  // Registra eventos nos botões de ação
  lista.querySelectorAll("[data-acao]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const itemEl  = botao.closest(".item-carrinho");
      const id      = itemEl.dataset.id;
      const produto = carrinho.find((p) => p.id === id);
      const acao    = botao.dataset.acao;

      if (acao === "aumentar") alterarQuantidade(id, produto.quantidade + 1);
      if (acao === "diminuir") alterarQuantidade(id, produto.quantidade - 1);
      if (acao === "remover")  removerItem(id);
    });
  });

  renderizarResumoCarrinho(carrinho);
}

// ─── Configurações de eventos ─────────────────────────────────────

/**
 * Configura os botões "Adicionar ao carrinho" em todas as páginas.
 */
function configurarBotoesAdicionar() {
  document.querySelectorAll("button").forEach((botao) => {
    if (!botao.textContent.toLowerCase().includes("adicionar ao carrinho")) return;

    botao.addEventListener("click", () => {
      const produto = buscarDadosDoCard(botao) || buscarDadosDaPaginaLivro(botao);
      if (produto) adicionarAoCarrinho(produto);
    });
  });
}
