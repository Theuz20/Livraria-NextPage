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

    if (!validarFormulariosCheckout()) {
      evento.preventDefault();
      mostrarMensagem("Preencha os dados obrigatorios antes de confirmar.");
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

function configurarCardsLivros() {
  document.querySelectorAll(".card-livro").forEach((card) => {
    if (!card.querySelector(".link-detalhes-livro")) {
      const linkDetalhes = document.createElement("a");
      linkDetalhes.className = "link-detalhes-livro";
      linkDetalhes.href = "livro.html";
      linkDetalhes.textContent = "Ver detalhes";
      linkDetalhes.setAttribute("aria-label", "Ver detalhes do livro");
      card.appendChild(linkDetalhes);
    }

    card.querySelector(".link-detalhes-livro")?.addEventListener("click", (evento) => {
      evento.preventDefault();
      abrirModalDetalhesLivro(card);
    });

    card.addEventListener("click", (evento) => {
      if (evento.target.closest("button, a")) return;
      abrirModalDetalhesLivro(card);
    });
  });
}

function abrirModalDetalhesLivro(card) {
  const botaoAdicionar = card.querySelector("button");
  const produto = (botaoAdicionar ? buscarDadosDoCard(botaoAdicionar) : null) || {
    titulo: card.querySelector("h3")?.textContent.trim() || "Livro",
    autor: card.querySelector(".autor-livro, .informacoes-livro p")?.textContent.trim() || "Autor não informado",
    categoria: card.querySelector(".categoria-livro, .categoria-card")?.textContent.trim() || "Livro",
    imagem: card.querySelector("img")?.getAttribute("src") || "",
  };
  const parcelamento = card.querySelector(".parcelamento")?.textContent.trim() || "Consulte as condições no checkout.";
  const preco = produto.preco ? moeda.format(produto.preco) : card.querySelector(".preco-livro")?.textContent.trim() || "";
  const parcelamentoExibido = card.querySelector(".parcelamento")?.textContent.trim() || "Consulte as condicoes no checkout.";
  const descricao = obterDescricaoLivro(produto.titulo, produto.categoria);
  const avaliacao = card.querySelector(".avaliacao-card, .avaliacao-detalhe")?.textContent.trim() || "Destaque do catalogo";

  document.querySelector(".modal-detalhes-livro")?.remove();

  const modal = document.createElement("div");
  modal.className = "modal-detalhes-livro";
  modal.innerHTML = `
    <div class="conteudo-modal-livro" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-livro">
      <button class="fechar-modal-livro" type="button" aria-label="Fechar detalhes">×</button>
      <img src="${escaparHtml(produto.imagem)}" alt="Capa do livro ${escaparHtml(produto.titulo)}">
      <div>
        <span class="categoria-livro">${escaparHtml(produto.categoria)}</span>
        <h2 id="titulo-modal-livro">${escaparHtml(produto.titulo)}</h2>
        <p>${escaparHtml(produto.autor)}</p>
        <strong>${escaparHtml(preco)}</strong>
        <small>${escaparHtml(parcelamentoExibido)}</small>
        <p class="descricao-modal-livro">${escaparHtml(descricao)}</p>
        <ul class="caracteristicas-modal-livro">
          <li>Categoria: ${escaparHtml(produto.categoria)}</li>
          <li>Autor: ${escaparHtml(produto.autor)}</li>
          <li>Avaliacao: ${escaparHtml(avaliacao)}</li>
        </ul>
        <p class="descricao-modal-livro">
          Livro selecionado no catálogo da NextPage. Confira categoria, autor, preço e adicione ao carrinho quando desejar comprar.
        </p>
        <a href="livro.html">Abrir página completa</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector(".fechar-modal-livro").innerHTML = "&times;";
  modal.querySelector(".conteudo-modal-livro a").textContent = "Abrir pagina completa";

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal || evento.target.closest(".fechar-modal-livro")) {
      modal.remove();
    }
  });
}

function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function removerAcentos(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterDescricaoLivro(titulo, categoria) {
  const descricoes = {
    "Clean Code": "Um guia pratico para escrever codigo mais claro, legivel e facil de manter, com foco em boas praticas de desenvolvimento.",
    "Entendendo Algoritmos": "Introducao visual e acessivel aos principais algoritmos, ideal para fortalecer logica e resolver problemas com mais seguranca.",
    "Python Fluente": "Obra avancada para quem quer dominar recursos modernos da linguagem Python e escrever programas mais expressivos.",
    "Arquitetura Limpa": "Apresenta principios de arquitetura de software para criar sistemas mais organizados, testaveis e preparados para evoluir.",
    "Habitos Atomicos": "Livro sobre construcao de habitos consistentes, melhoria continua e pequenas mudancas com grande impacto no dia a dia.",
    "O Hobbit": "Aventura de fantasia classica com jornada, descoberta e personagens marcantes em um universo rico e imaginativo.",
    "Pai Rico Pai Pobre": "Introducao popular a educacao financeira, mentalidade sobre dinheiro, ativos, passivos e independencia financeira.",
    "Dom Casmurro": "Romance classico brasileiro de Machado de Assis, marcado por narrador ambiguo, memoria e relacoes complexas.",
    "1984": "Distopia politica sobre vigilancia, controle social e liberdade individual, uma das obras mais influentes da literatura moderna.",
    "Essencialismo": "Livro de produtividade que ajuda a priorizar o que realmente importa e eliminar excessos na rotina.",
    "JavaScript Definitivo": "Referencia abrangente para aprender JavaScript em profundidade, cobrindo fundamentos e recursos da linguagem.",
    "O Programador Pragmatico": "Conjunto de conselhos praticos para evoluir como desenvolvedor, tomar melhores decisoes tecnicas e cuidar da qualidade.",
    "Harry Potter": "Fantasia sobre amizade, magia e amadurecimento, acompanhando a descoberta de um mundo extraordinario.",
    "O Homem Mais Rico da Babilonia": "Classico de financas pessoais com licoes simples sobre poupar, investir e administrar dinheiro.",
    "Orgulho e Preconceito": "Romance classico de Jane Austen sobre amor, orgulho, aparencias e relacoes sociais.",
  };
  const chave = removerAcentos(titulo);

  return descricoes[chave] || `Livro da categoria ${categoria}, selecionado no catalogo da NextPage com informacoes de autor, preco e detalhes para apoiar sua escolha.`;
}

function validarFormulariosCheckout() {
  const formularios = document.querySelectorAll(".pagina-checkout form");
  const validade = document.querySelector(".pagina-checkout #validade");

  if (validade && !validadeCartaoEhAtualOuFutura(validade.value)) {
    validade.setCustomValidity("A validade deve ser igual ou posterior a 05/26.");
  } else {
    validade?.setCustomValidity("");
  }

  for (const formulario of formularios) {
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return false;
    }
  }

  return true;
}

function manterSomenteLetras(input) {
  input.value = input.value.replace(/[^\p{L}\s]/gu, "");
}

function manterSomenteNumeros(input, limite) {
  input.value = input.value.replace(/\D/g, "").slice(0, limite);
}

function formatarValidade(input) {
  const numeros = input.value.replace(/\D/g, "").slice(0, 4);
  input.value = numeros.length > 2 ? `${numeros.slice(0, 2)}/${numeros.slice(2)}` : numeros;
}

function formatarCep(input) {
  const numeros = input.value.replace(/\D/g, "").slice(0, 8);
  input.value = numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros;
}

function formatarCpf(input) {
  const numeros = input.value.replace(/\D/g, "").slice(0, 11);
  input.value = numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function emailEhValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
}

function validadeCartaoEhAtualOuFutura(valor) {
  const resultado = valor.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!resultado) return false;

  const mes = Number(resultado[1]);
  const ano = 2000 + Number(resultado[2]);
  const dataMinima = new Date(2026, 4, 1);
  const dataInformada = new Date(ano, mes - 1, 1);

  return dataInformada >= dataMinima;
}

function configurarValidacoesCheckout() {
  const paginaCheckout = document.querySelector(".pagina-checkout");
  if (!paginaCheckout) return;

  ["#nome", "#cidade", "#titular"].forEach((seletor) => {
    const input = paginaCheckout.querySelector(seletor);
    input?.addEventListener("input", () => manterSomenteLetras(input));
  });

  [
    ["#numero", 12],
    ["#cartao", 16],
    ["#cvv", 3],
    ["#telefone", 11],
  ].forEach(([seletor, limite]) => {
    const input = paginaCheckout.querySelector(seletor);
    input?.addEventListener("input", () => manterSomenteNumeros(input, limite));
  });

  const cpf = paginaCheckout.querySelector("#cpf");
  cpf?.addEventListener("input", () => formatarCpf(cpf));

  const cep = paginaCheckout.querySelector("#cep");
  cep?.addEventListener("input", () => formatarCep(cep));

  const email = paginaCheckout.querySelector("#email");
  email?.addEventListener("input", () => {
    if (!email.value || emailEhValido(email.value)) {
      email.setCustomValidity("");
    } else {
      email.setCustomValidity("Digite um e-mail valido, como nome@dominio.com.");
    }
  });

  const validade = paginaCheckout.querySelector("#validade");
  validade?.addEventListener("input", () => {
    formatarValidade(validade);
    validade.setCustomValidity("");
  });

  validade?.addEventListener("blur", () => {
    if (validade.value && !validadeCartaoEhAtualOuFutura(validade.value)) {
      validade.setCustomValidity("A validade deve ser igual ou posterior a 05/26.");
    } else {
      validade.setCustomValidity("");
    }
  });
}

function configurarOpcoesSelecionaveis() {
  document.querySelectorAll(".opcoes-entrega, .metodos-pagamento").forEach((grupo) => {
    const opcoes = grupo.querySelectorAll(".opcao-entrega, .metodo-pagamento");

    opcoes.forEach((opcao) => {
      const radio = opcao.querySelector("input[type='radio']");

      opcao.addEventListener("click", () => {
        radio.checked = true;
        opcoes.forEach((item) => item.classList.remove("ativa"));
        opcao.classList.add("ativa");
      });

      radio?.addEventListener("change", () => {
        opcoes.forEach((item) => item.classList.remove("ativa"));
        opcao.classList.add("ativa");
      });
    });
  });
}

function configurarMascarasGerais() {
  document.querySelectorAll("input[type='email']").forEach((email) => {
    email.addEventListener("input", () => {
      if (!email.value || emailEhValido(email.value)) {
        email.setCustomValidity("");
      } else {
        email.setCustomValidity("Digite um e-mail valido, como nome@dominio.com.");
      }
    });
  });

  document.querySelectorAll("input[type='tel']").forEach((telefone) => {
    telefone.addEventListener("input", () => manterSomenteNumeros(telefone, 11));
  });

  document.querySelectorAll("input[id*='cpf']").forEach((cpf) => {
    cpf.addEventListener("input", () => formatarCpf(cpf));
  });

  document.querySelectorAll("input[id*='cep']").forEach((cep) => {
    cep.addEventListener("input", () => formatarCep(cep));
  });
}

function textoNormalizado(texto) {
  return removerAcentos(texto).toLowerCase().trim();
}

function configurarFiltrosLivros() {
  const filtros = document.querySelector(".filtros-livros");
  const grade = document.querySelector(".catalogo-livros");
  if (!filtros || !grade) return;

  let mensagemVazia = grade.querySelector(".mensagem-filtro-vazio");
  if (!mensagemVazia) {
    mensagemVazia = document.createElement("p");
    mensagemVazia.className = "mensagem-filtro-vazio oculto";
    mensagemVazia.textContent = "Nenhum livro encontrado nessa categoria.";
    grade.appendChild(mensagemVazia);
  }

  filtros.querySelectorAll("button").forEach((botao) => {
    botao.addEventListener("click", () => {
      const categoriaSelecionada = textoNormalizado(botao.textContent);
      let totalVisivel = 0;

      filtros.querySelectorAll("button").forEach((item) => item.classList.remove("ativo"));
      botao.classList.add("ativo");

      grade.querySelectorAll(".card-livro").forEach((card) => {
        const categoriaCard = textoNormalizado(card.querySelector(".categoria-livro")?.textContent || "");
        const deveMostrar = categoriaSelecionada === "todos" || categoriaCard === categoriaSelecionada;

        card.classList.toggle("oculto", !deveMostrar);
        if (deveMostrar) totalVisivel += 1;
      });

      mensagemVazia.classList.toggle("oculto", totalVisivel > 0);
    });
  });
}

function configurarFormularios() {
  document.querySelectorAll(".formulario-acesso, .formulario-contato").forEach((formulario) => {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
      }

      const senha = formulario.querySelector("#senha-cadastro");
      const confirmarSenha = formulario.querySelector("#confirmar-senha");

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
  configurarCardsLivros();
  configurarBotoesAdicionar();
  configurarFormularios();
  configurarMascarasGerais();
  configurarValidacoesCheckout();
  configurarOpcoesSelecionaveis();
  configurarFiltrosLivros();
  atualizarContadorCarrinho();
  renderizarCarrinho();
  renderizarCheckout();
  renderizarPedidoConfirmado();
});
