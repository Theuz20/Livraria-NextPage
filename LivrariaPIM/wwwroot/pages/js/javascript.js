const CART_KEY = "nextpage-cart";
const ORDER_KEY = "nextpage-last-order";
const FRETE_PADRAO = 12.9;

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const LIVROS_CATALOGO = [
  {
    id: "clean-code",
    titulo: "Clean Code",
    autor: "Robert C. Martin",
    categoria: "Programação",
    preco: 79.9,
    imagem: "assets/img/clean-code.jpg",
    parcelamento: "ou 2x de R$ 39,95 sem juros",
    avaliacao: "4.9",
    avaliacoes: "245 avaliações de clientes",
    badge: "Mais vendido",
    editora: "Alta Books",
    paginas: "425 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Um guia essencial para escrever código mais claro, organizado e fácil de manter. Indicado para desenvolvedores que querem melhorar a qualidade dos próprios projetos.",
    sobre: [
      "Clean Code apresenta princípios, práticas e exemplos para transformar código confuso em código legível.",
      "O livro mostra como nomear variáveis, organizar funções, evitar duplicação, escrever testes e construir sistemas mais fáceis de evoluir.",
    ],
  },
  {
    id: "entendendo-algoritmos",
    titulo: "Entendendo Algoritmos",
    autor: "Aditya Bhargava",
    categoria: "Tecnologia",
    preco: 64.9,
    imagem: "assets/img/algoritmos.jpg",
    parcelamento: "ou 2x de R$ 32,45 sem juros",
    avaliacao: "4.8",
    avaliacoes: "198 avaliações de clientes",
    badge: "Popular",
    editora: "Novatec",
    paginas: "264 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Introdução visual e acessível aos principais algoritmos, ideal para fortalecer lógica e resolver problemas com mais segurança.",
    sobre: [
      "A obra explica busca, ordenação, recursão, grafos e outros conceitos com linguagem simples.",
      "É uma ótima escolha para quem quer aprender algoritmos sem começar por uma abordagem excessivamente teórica.",
    ],
  },
  {
    id: "python-fluente",
    titulo: "Python Fluente",
    autor: "Luciano Ramalho",
    categoria: "Python",
    preco: 89.9,
    imagem: "assets/img/python-fluente.jpg",
    parcelamento: "ou 3x de R$ 29,97 sem juros",
    avaliacao: "4.9",
    avaliacoes: "176 avaliações de clientes",
    badge: "Novo",
    editora: "Novatec",
    paginas: "792 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Obra avançada para quem quer dominar recursos modernos da linguagem Python e escrever programas mais expressivos.",
    sobre: [
      "Python Fluente aprofunda coleções, funções, classes, protocolos, concorrência e idiomatismos da linguagem.",
      "É recomendado para quem já conhece Python e quer escrever código mais elegante e profissional.",
    ],
  },
  {
    id: "arquitetura-limpa",
    titulo: "Arquitetura Limpa",
    autor: "Robert C. Martin",
    categoria: "Back-end",
    preco: 72.9,
    imagem: "assets/img/arquitetura-limpa.jpg",
    parcelamento: "ou 2x de R$ 36,45 sem juros",
    avaliacao: "4.8",
    avaliacoes: "221 avaliações de clientes",
    badge: "Destaque",
    editora: "Alta Books",
    paginas: "432 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Apresenta princípios de arquitetura de software para criar sistemas mais organizados, testáveis e preparados para evoluir.",
    sobre: [
      "O livro discute limites, dependências, componentes e decisões arquiteturais duradouras.",
      "É uma leitura útil para desenvolvedores que querem pensar além da implementação imediata.",
    ],
  },
  {
    id: "habitos-atomicos",
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    categoria: "Desenvolvimento pessoal",
    preco: 59.9,
    imagem: "assets/img/habitos-atomicos.png",
    parcelamento: "ou 2x de R$ 29,95 sem juros",
    avaliacao: "4.9",
    avaliacoes: "310 avaliações de clientes",
    badge: "Destaque",
    editora: "Alta Life",
    paginas: "320 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Livro sobre construção de hábitos consistentes, melhoria contínua e pequenas mudanças com grande impacto no dia a dia.",
    sobre: [
      "A obra mostra como sistemas, ambiente e repetição ajudam a transformar comportamentos.",
      "É indicada para quem quer melhorar rotina, foco, produtividade e disciplina pessoal.",
    ],
  },
  {
    id: "o-hobbit",
    titulo: "O Hobbit",
    autor: "J.R.R. Tolkien",
    categoria: "Fantasia",
    preco: 49.9,
    imagem: "assets/img/o-hobbit.png",
    parcelamento: "ou 2x de R$ 24,95 sem juros",
    avaliacao: "4.9",
    avaliacoes: "287 avaliações de clientes",
    badge: "Clássico",
    editora: "HarperCollins",
    paginas: "336 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Aventura de fantasia clássica com jornada, descoberta e personagens marcantes em um universo rico e imaginativo.",
    sobre: [
      "Bilbo Bolseiro parte em uma jornada inesperada ao lado de anões e do mago Gandalf.",
      "A narrativa combina aventura, humor, fantasia e a construção de um mundo literário inesquecível.",
    ],
  },
  {
    id: "pai-rico-pai-pobre",
    titulo: "Pai Rico Pai Pobre",
    autor: "Robert Kiyosaki",
    categoria: "Negócios",
    preco: 39.9,
    imagem: "assets/img/pai-rico-pai-pobre.png",
    parcelamento: "ou 2x de R$ 19,95 sem juros",
    avaliacao: "4.7",
    avaliacoes: "192 avaliações de clientes",
    badge: "Popular",
    editora: "Alta Books",
    paginas: "336 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Introdução popular à educação financeira, mentalidade sobre dinheiro, ativos, passivos e independência financeira.",
    sobre: [
      "O livro compara diferentes formas de pensar sobre trabalho, renda e patrimônio.",
      "É uma leitura introdutória para quem quer repensar hábitos financeiros e planejamento pessoal.",
    ],
  },
  {
    id: "dom-casmurro",
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    categoria: "Romance",
    preco: 29.9,
    imagem: "assets/img/dom-casmurro.jpg",
    parcelamento: "à vista",
    avaliacao: "4.8",
    avaliacoes: "144 avaliações de clientes",
    badge: "Clássico",
    editora: "Principis",
    paginas: "240 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Romance clássico brasileiro marcado por narrador ambíguo, memória, ciúme e relações complexas.",
    sobre: [
      "Bentinho reconstrói sua juventude e sua relação com Capitu por meio de lembranças e suspeitas.",
      "A obra é uma das mais discutidas da literatura brasileira pela força de sua ambiguidade.",
    ],
  },
  {
    id: "1984",
    titulo: "1984",
    autor: "George Orwell",
    categoria: "Ficção",
    preco: 34.9,
    imagem: "assets/img/1984.jpg",
    parcelamento: "à vista",
    avaliacao: "4.8",
    avaliacoes: "187 avaliações de clientes",
    badge: "Clássico",
    editora: "Companhia das Letras",
    paginas: "416 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Distopia política sobre vigilância, controle social e liberdade individual, uma das obras mais influentes da literatura moderna.",
    sobre: [
      "Winston Smith vive em uma sociedade controlada pelo Partido e pelo Grande Irmão.",
      "O livro segue atual por discutir manipulação da verdade, vigilância e autoritarismo.",
    ],
  },
  {
    id: "essencialismo",
    titulo: "Essencialismo",
    autor: "Greg McKeown",
    categoria: "Produtividade",
    preco: 44.9,
    imagem: "assets/img/essencialismo.jpg",
    parcelamento: "à vista",
    avaliacao: "4.7",
    avaliacoes: "165 avaliações de clientes",
    badge: "Produtividade",
    editora: "Sextante",
    paginas: "272 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Livro de produtividade que ajuda a priorizar o que realmente importa e eliminar excessos na rotina.",
    sobre: [
      "A proposta central é fazer menos, porém melhor, escolhendo conscientemente onde investir energia.",
      "É indicado para quem se sente sobrecarregado e quer organizar prioridades com mais clareza.",
    ],
  },
  {
    id: "javascript-definitivo",
    titulo: "JavaScript Definitivo",
    autor: "David Flanagan",
    categoria: "Front-end",
    preco: 94.9,
    imagem: "assets/img/javascript-definitivo.jpg",
    parcelamento: "ou 3x de R$ 31,63 sem juros",
    avaliacao: "4.8",
    avaliacoes: "204 avaliações de clientes",
    badge: "Front-end",
    editora: "Bookman",
    paginas: "704 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Referência abrangente para aprender JavaScript em profundidade, cobrindo fundamentos e recursos da linguagem.",
    sobre: [
      "O livro aborda tipos, objetos, funções, módulos, APIs e padrões importantes do ecossistema JavaScript.",
      "É uma boa referência para estudo contínuo e consulta durante projetos web.",
    ],
  },
  {
    id: "programador-pragmatico",
    titulo: "O Programador Pragmático",
    autor: "Andrew Hunt",
    categoria: "Programação",
    preco: 84.9,
    imagem: "assets/img/programador-pragmatico.jpg",
    parcelamento: "ou 2x de R$ 42,45 sem juros",
    avaliacao: "4.9",
    avaliacoes: "212 avaliações de clientes",
    badge: "Destaque",
    editora: "Bookman",
    paginas: "352 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Conjunto de conselhos práticos para evoluir como desenvolvedor, tomar melhores decisões técnicas e cuidar da qualidade.",
    sobre: [
      "A obra combina filosofia de trabalho, práticas de código e postura profissional.",
      "É recomendada para quem quer desenvolver autonomia, senso crítico e consistência na carreira.",
    ],
  },
  {
    id: "harry-potter",
    titulo: "Harry Potter",
    autor: "J.K. Rowling",
    categoria: "Fantasia",
    preco: 69.9,
    imagem: "assets/img/harry-potter.jpg",
    parcelamento: "ou 2x de R$ 34,95 sem juros",
    avaliacao: "4.9",
    avaliacoes: "340 avaliações de clientes",
    badge: "Fantasia",
    editora: "Rocco",
    paginas: "264 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Fantasia sobre amizade, magia e amadurecimento, acompanhando a descoberta de um mundo extraordinário.",
    sobre: [
      "Harry descobre sua origem e entra em uma escola de magia cheia de mistérios.",
      "A história combina aventura, laços de amizade e conflitos que crescem junto com o protagonista.",
    ],
  },
  {
    id: "homem-rico-babilonia",
    titulo: "O Homem Mais Rico da Babilônia",
    autor: "George S. Clason",
    categoria: "Finanças",
    preco: 32.9,
    imagem: "assets/img/homem-rico-babilonia.jpg",
    parcelamento: "à vista",
    avaliacao: "4.7",
    avaliacoes: "173 avaliações de clientes",
    badge: "Finanças",
    editora: "HarperCollins",
    paginas: "160 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Clássico de finanças pessoais com lições simples sobre poupar, investir e administrar dinheiro.",
    sobre: [
      "Por meio de parábolas, o livro ensina princípios de organização financeira pessoal.",
      "É uma leitura curta e direta para quem quer começar a cuidar melhor do próprio dinheiro.",
    ],
  },
  {
    id: "orgulho-preconceito",
    titulo: "Orgulho e Preconceito",
    autor: "Jane Austen",
    categoria: "Romance",
    preco: 42.9,
    imagem: "assets/img/orgulho-preconceito.jpg",
    parcelamento: "à vista",
    avaliacao: "4.8",
    avaliacoes: "201 avaliações de clientes",
    badge: "Romance",
    editora: "Penguin",
    paginas: "424 páginas",
    idioma: "Português",
    formato: "Capa comum",
    descricao: "Romance clássico de Jane Austen sobre amor, orgulho, aparências e relações sociais.",
    sobre: [
      "Elizabeth Bennet e Mr. Darcy protagonizam uma narrativa marcada por ironia e transformação pessoal.",
      "A obra observa costumes, classe social e expectativas familiares com inteligência e humor.",
    ],
  },
];

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

function buscarLivroPorId(id) {
  return LIVROS_CATALOGO.find((livro) => livro.id === id);
}

function buscarLivroPorTitulo(titulo) {
  const id = criarId(titulo);
  return buscarLivroPorId(id);
}

function livroParaCarrinho(livro) {
  return {
    id: livro.id,
    titulo: livro.titulo,
    autor: livro.autor,
    categoria: livro.categoria,
    preco: livro.preco,
    imagem: livro.imagem,
    quantidade: 1,
  };
}

function buscarDadosDoCard(botao) {
  const card = botao.closest(".card-livro");
  if (!card) return null;

  const titulo = card.querySelector("h3")?.textContent.trim();
  const livroCatalogo = titulo ? buscarLivroPorTitulo(titulo) : null;
  if (livroCatalogo) return livroParaCarrinho(livroCatalogo);

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
  const livroCatalogo = titulo ? buscarLivroPorTitulo(titulo) : null;
  if (livroCatalogo) return livroParaCarrinho(livroCatalogo);

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
    const titulo = card.querySelector("h3")?.textContent.trim();
    const livro = titulo ? buscarLivroPorTitulo(titulo) : null;
    const urlDetalhes = livro ? `livro.html?id=${livro.id}` : "livro.html";

    card.dataset.livroId = livro?.id || "";
    card.querySelectorAll("a[href='livro.html']").forEach((link) => {
      link.href = urlDetalhes;
    });

    if (!card.querySelector(".link-detalhes-livro")) {
      const linkDetalhes = document.createElement("a");
      linkDetalhes.className = "link-detalhes-livro";
      linkDetalhes.href = urlDetalhes;
      linkDetalhes.textContent = "Ver detalhes";
      linkDetalhes.setAttribute("aria-label", "Ver detalhes do livro");
      card.appendChild(linkDetalhes);
    }

    const linkDetalhes = card.querySelector(".link-detalhes-livro");
    if (linkDetalhes) linkDetalhes.href = urlDetalhes;

    card.addEventListener("click", (evento) => {
      if (evento.target.closest("button, a")) return;
      window.location.href = urlDetalhes;
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

function renderizarDetalheLivroDinamico() {
  const paginaDetalhe = document.querySelector(".pagina-detalhe");
  if (!paginaDetalhe) return;

  const parametros = new URLSearchParams(window.location.search);
  const livro = buscarLivroPorId(parametros.get("id")) || buscarLivroPorId("clean-code");
  const capa = paginaDetalhe.querySelector(".capa-detalhe img");
  const badge = paginaDetalhe.querySelector(".badge-detalhe");
  const categoria = paginaDetalhe.querySelector(".conteudo-detalhe .categoria-livro");
  const titulo = paginaDetalhe.querySelector(".conteudo-detalhe h1");
  const autor = paginaDetalhe.querySelector(".autor-detalhe");
  const avaliacao = paginaDetalhe.querySelector(".avaliacao-detalhe");
  const descricaoCurta = paginaDetalhe.querySelector(".descricao-curta");
  const preco = paginaDetalhe.querySelector(".preco-detalhe");
  const parcelamento = paginaDetalhe.querySelector(".parcelamento-detalhe");
  const blocoDescricao = paginaDetalhe.querySelector(".bloco-descricao");
  const ficha = paginaDetalhe.querySelector(".ficha-tecnica dl");

  document.title = `${livro.titulo} | NextPage`;
  if (capa) {
    capa.src = livro.imagem;
    capa.alt = `Capa do livro ${livro.titulo}`;
  }
  if (badge) badge.textContent = livro.badge;
  if (categoria) categoria.textContent = livro.categoria;
  if (titulo) titulo.textContent = livro.titulo;
  if (autor) autor.textContent = livro.autor;
  if (avaliacao) {
    avaliacao.innerHTML = `
      <span>★★★★★</span>
      <strong>${escaparHtml(livro.avaliacao)}</strong>
      <p>${escaparHtml(livro.avaliacoes)}</p>
    `;
  }
  if (descricaoCurta) descricaoCurta.textContent = livro.descricao;
  if (preco) preco.textContent = moeda.format(livro.preco);
  if (parcelamento) parcelamento.textContent = livro.parcelamento;
  if (blocoDescricao) {
    blocoDescricao.innerHTML = `
      <h2>Sobre o livro</h2>
      ${livro.sobre.map((paragrafo) => `<p>${escaparHtml(paragrafo)}</p>`).join("")}
    `;
  }
  if (ficha) {
    ficha.innerHTML = `
      <div>
        <dt>Autor</dt>
        <dd>${escaparHtml(livro.autor)}</dd>
      </div>
      <div>
        <dt>Editora</dt>
        <dd>${escaparHtml(livro.editora)}</dd>
      </div>
      <div>
        <dt>Páginas</dt>
        <dd>${escaparHtml(livro.paginas)}</dd>
      </div>
      <div>
        <dt>Idioma</dt>
        <dd>${escaparHtml(livro.idioma)}</dd>
      </div>
      <div>
        <dt>Categoria</dt>
        <dd>${escaparHtml(livro.categoria)}</dd>
      </div>
      <div>
        <dt>Formato</dt>
        <dd>${escaparHtml(livro.formato)}</dd>
      </div>
    `;
  }
}

function atualizarLinksCategorias() {
  document.querySelectorAll(".categoria-detalhada").forEach((link) => {
    const categoria = link.querySelector("h2")?.textContent.trim();
    if (categoria) link.href = `livros.html?categoria=${encodeURIComponent(criarId(categoria))}`;
  });

  document.querySelectorAll(".colecao-card").forEach((card) => {
    const titulo = textoNormalizado(card.querySelector("h3")?.textContent || "");
    const link = card.querySelector("a");
    if (!link) return;

    if (titulo.includes("programacao")) link.href = "livros.html?categoria=programacao";
    else if (titulo.includes("classicos")) link.href = "livros.html?categoria=ficcao";
    else if (titulo.includes("produtividade")) link.href = "livros.html?categoria=produtividade";
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

function chaveCategoria(texto) {
  return criarId(texto).replace(/-/g, "");
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

  const aplicarFiltro = (botao) => {
      const categoriaSelecionada = textoNormalizado(botao.textContent);
      const chaveSelecionada = chaveCategoria(botao.textContent);
      let totalVisivel = 0;

      filtros.querySelectorAll("button").forEach((item) => item.classList.remove("ativo"));
      botao.classList.add("ativo");

      grade.querySelectorAll(".card-livro").forEach((card) => {
        const categoriaCardTexto = card.querySelector(".categoria-livro")?.textContent || "";
        const categoriaCard = textoNormalizado(categoriaCardTexto);
        const deveMostrar = categoriaSelecionada === "todos" ||
          categoriaCard === categoriaSelecionada ||
          chaveCategoria(categoriaCardTexto) === chaveSelecionada;

        card.classList.toggle("oculto", !deveMostrar);
        if (deveMostrar) totalVisivel += 1;
      });

      mensagemVazia.classList.toggle("oculto", totalVisivel > 0);
  };

  filtros.querySelectorAll("button").forEach((botao) => {
    botao.addEventListener("click", () => {
      aplicarFiltro(botao);
    });
  });

  const categoriaUrl = new URLSearchParams(window.location.search).get("categoria");
  if (categoriaUrl) {
    const chaveUrl = chaveCategoria(categoriaUrl);
    const botaoInicial = Array.from(filtros.querySelectorAll("button"))
      .find((botao) => chaveCategoria(botao.textContent) === chaveUrl);

    if (botaoInicial) aplicarFiltro(botaoInicial);
  }
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
  renderizarDetalheLivroDinamico();
  atualizarLinksCategorias();
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
