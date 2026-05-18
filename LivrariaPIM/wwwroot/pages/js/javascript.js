const CART_KEY = "nextpage-cart";
const ORDER_KEY = "nextpage-last-order";
const FRETE_PADRAO = 12.9;

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function lerCarrinho() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

function textoParaPreco(texto) {
  return Number(
    texto
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
}

function criarId(titulo) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buscarDadosDoCard(botao) {
  const card = botao.closest(".card-livro");
  if (!card) return null;

  const titulo = card.querySelector("h3")?.textContent.trim();
  const autor = card.querySelector(".autor-livro, .informacoes-livro p")?.textContent.trim() || "";
  const categoria = card.querySelector(".categoria-livro, .categoria-card")?.textContent.trim() || "Livro";
  const precoTexto = card.querySelector(".preco-livro")?.textContent.trim();
  const imagem = card.querySelector("img")?.getAttribute("src") || "";

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

function buscarDadosDaPaginaLivro(botao) {
  const detalhe = botao.closest(".detalhe-livro");
  if (!detalhe) return null;

  const titulo = detalhe.querySelector("h1")?.textContent.trim();
  const autor = detalhe.querySelector(".autor-detalhe")?.textContent.trim() || "";
  const categoria = detalhe.querySelector(".categoria-livro")?.textContent.trim() || "Livro";
  const precoTexto = detalhe.querySelector(".preco-detalhe")?.textContent.trim();
  const imagem = detalhe.querySelector("img")?.getAttribute("src") || "";

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

function adicionarAoCarrinho(produto) {
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

function configurarBotoesAdicionar() {
  const botoes = document.querySelectorAll("button");

  botoes.forEach((botao) => {
    if (!botao.textContent.toLowerCase().includes("adicionar ao carrinho")) return;

    botao.addEventListener("click", () => {
      const produto = buscarDadosDoCard(botao) || buscarDadosDaPaginaLivro(botao);
      if (produto) adicionarAoCarrinho(produto);
    });
  });
}

function atualizarContadorCarrinho() {
  const totalItens = lerCarrinho().reduce((total, item) => total + item.quantidade, 0);
  const botoesCarrinho = document.querySelectorAll(".botao-carrinho");

 botoesCarrinho.forEach((botao) => {
    botao.innerHTML = `
      <span class="texto-carrinho">Carrinho</span>
      ${totalItens > 0 ? `<span class="badge-carrinho">${totalItens}</span>` : ""}
    `;
  });
}

function calcularTotais(carrinho) {
  const subtotal = carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const frete = subtotal > 0 && subtotal < 149 ? FRETE_PADRAO : 0;
  const desconto = 0;
  const total = subtotal + frete - desconto;

  return { subtotal, frete, desconto, total };
}

function alterarQuantidade(id, quantidade) {
  const carrinho = lerCarrinho()
    .map((item) => (item.id === id ? { ...item, quantidade } : item))
    .filter((item) => item.quantidade > 0);

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function removerItem(id) {
  const carrinho = lerCarrinho().filter((item) => item.id !== id);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function criarItemCarrinho(item) {
  return `
    <article class="item-carrinho" data-id="${item.id}">
      <a class="imagem-item" href="livro.html">
        <img src="${item.imagem}" alt="Capa do livro ${item.titulo}">
      </a>

      <div class="dados-item">
        <span class="categoria-livro">${item.categoria}</span>
        <a href="livro.html">
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

function criarCarrinhoVazio() {
  return `
    <div class="carrinho-vazio">
      <h3>Seu carrinho está vazio</h3>
      <p>Escolha alguns livros no catálogo para continuar sua compra.</p>
      <a href="livros.html">Ver livros</a>
    </div>
  `;
}

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

function renderizarCarrinho() {
  const lista = document.querySelector(".lista-carrinho");
  if (!lista) return;

  const carrinho = lerCarrinho();
  const cabecalho = lista.querySelector(".cabecalho-lista");
  const opcoes = lista.querySelector(".opcoes-carrinho");

  lista.querySelectorAll(".item-carrinho, .carrinho-vazio").forEach((elemento) => elemento.remove());

  const totalProdutos = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const contador = cabecalho?.querySelector("span");
  if (contador) contador.textContent = `${totalProdutos} ${totalProdutos === 1 ? "produto" : "produtos"}`;

  const html = carrinho.length > 0
    ? carrinho.map(criarItemCarrinho).join("")
    : criarCarrinhoVazio();

  opcoes?.insertAdjacentHTML("beforebegin", html);
  if (carrinho.length === 0) opcoes?.classList.add("oculto");
  else opcoes?.classList.remove("oculto");

  lista.querySelectorAll("[data-acao]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const item = botao.closest(".item-carrinho");
      const id = item.dataset.id;
      const produto = carrinho.find((produtoCarrinho) => produtoCarrinho.id === id);
      const acao = botao.dataset.acao;

      if (acao === "aumentar") alterarQuantidade(id, produto.quantidade + 1);
      if (acao === "diminuir") alterarQuantidade(id, produto.quantidade - 1);
      if (acao === "remover") removerItem(id);
    });
  });

  renderizarResumoCarrinho(carrinho);
}

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

function renderizarCheckout() {
  const resumo = document.querySelector(".resumo-checkout");
  if (!resumo) return;

  const carrinho = lerCarrinho();
  const { subtotal, frete, desconto, total } = calcularTotais(carrinho);

  resumo.innerHTML = `
    <h2>Resumo do pedido</h2>

    ${carrinho.length > 0 ? carrinho.map(criarItemResumo).join("") : "<p class='checkout-vazio'>Nenhum item no carrinho.</p>"}

    <div class="linhas-resumo">
      <div>
        <span>Subtotal</span>
        <strong>${moeda.format(subtotal)}</strong>
      </div>

      <div>
        <span>Frete</span>
        <strong>${frete === 0 ? "Grátis" : moeda.format(frete)}</strong>
      </div>

      <div>
        <span>Desconto</span>
        <strong>- ${moeda.format(desconto)}</strong>
      </div>
    </div>

    <div class="total-checkout">
      <span>Total</span>
      <strong>${moeda.format(total)}</strong>
    </div>

    <a class="botao-confirmar-pedido ${carrinho.length === 0 ? "desabilitado" : ""}" href="pedido-confirmado.html">Confirmar pedido</a>

    <p class="mensagem-segura">Pagamento protegido e dados criptografados.</p>
  `;

  const botaoConfirmar = resumo.querySelector(".botao-confirmar-pedido");
  botaoConfirmar?.addEventListener("click", (evento) => {
    if (carrinho.length === 0) {
      evento.preventDefault();
      mostrarMensagem("Adicione livros ao carrinho antes de finalizar.");
      return;
    }

    localStorage.setItem(ORDER_KEY, JSON.stringify({
      numero: `#NP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      data: new Date().toLocaleDateString("pt-BR"),
      itens: carrinho,
      total,
      frete,
      subtotal,
    }));

    localStorage.removeItem(CART_KEY);
  });
}

function renderizarPedidoConfirmado() {
  const pagina = document.querySelector(".pagina-confirmacao");
  if (!pagina) return;

  const pedido = JSON.parse(localStorage.getItem(ORDER_KEY));
  if (!pedido) return;

  const detalhes = pagina.querySelector(".detalhes-pedido dl");
  if (detalhes) {
    detalhes.innerHTML = `
      <div>
        <dt>Número do pedido</dt>
        <dd>${pedido.numero}</dd>
      </div>
      <div>
        <dt>Data</dt>
        <dd>${pedido.data}</dd>
      </div>
      <div>
        <dt>Pagamento</dt>
        <dd>Cartão de crédito</dd>
      </div>
      <div>
        <dt>Entrega</dt>
        <dd>Até 5 dias úteis</dd>
      </div>
      <div>
        <dt>Total</dt>
        <dd>${moeda.format(pedido.total)}</dd>
      </div>
    `;
  }

  const lista = pagina.querySelector(".lista-livros-confirmados");
  if (lista) {
    lista.innerHTML = pedido.itens.map((item) => `
      <article>
        <img src="${item.imagem}" alt="Capa do livro ${item.titulo}">
        <div>
          <h3>${item.titulo}</h3>
          <p>${item.autor}</p>
        </div>
        <strong>${moeda.format(item.preco * item.quantidade)}</strong>
      </article>
    `).join("");
  }
}

function mostrarMensagem(texto) {
  const mensagemAntiga = document.querySelector(".mensagem-carrinho");
  mensagemAntiga?.remove();

  const mensagem = document.createElement("div");
  mensagem.className = "mensagem-carrinho";
  mensagem.textContent = texto;

  document.body.appendChild(mensagem);

  setTimeout(() => {
    mensagem.classList.add("visivel");
  }, 10);

  setTimeout(() => {
    mensagem.classList.remove("visivel");
    setTimeout(() => mensagem.remove(), 250);
  }, 2600);
}

document.addEventListener("DOMContentLoaded", () => {
  configurarBotoesAdicionar();
  atualizarContadorCarrinho();
  renderizarCarrinho();
  renderizarCheckout();
  renderizarPedidoConfirmado();
});