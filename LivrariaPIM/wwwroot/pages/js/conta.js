// conta.js
// Módulo principal da área "Minha Conta" da NextPage.
// Gerencia dashboard, histórico, biblioteca, favoritos, configurações e relatórios de leitura.

// ── Constantes de storage ──────────────────────────────────────────
const PEDIDOS_KEY = "nextpage-historico-pedidos";
const FAVORITOS_KEY = "nextpage-favoritos";
const LEITURA_KEY = "nextpage-leitura";
const VISTOS_KEY = "nextpage-vistos-recentemente";

const moedaConta = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// ── Dados simulados de pedidos ─────────────────────────────────────

function obterPedidosSimulados(usuario) {
  const hoje = new Date();
  const dias = (n) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() - n);
    return d.toLocaleDateString("pt-BR");
  };

  return [
    {
      id: "#NP-2026-48291",
      data: dias(5),
      status: "entregue",
      total: 159.80,
      itens: [
        { id: "clean-code", titulo: "Clean Code", autor: "Robert C. Martin", preco: 79.90, imagem: "assets/img/clean-code.jpg", categoria: "Programação", quantidade: 1 },
        { id: "arquitetura-limpa", titulo: "Arquitetura Limpa", autor: "Robert C. Martin", preco: 72.90, imagem: "assets/img/arquitetura-limpa.jpg", categoria: "Back-end", quantidade: 1 },
      ],
    },
    {
      id: "#NP-2026-39014",
      data: dias(18),
      status: "entregue",
      total: 109.80,
      itens: [
        { id: "habitos-atomicos", titulo: "Hábitos Atômicos", autor: "James Clear", preco: 59.90, imagem: "assets/img/habitos-atomicos.png", categoria: "Desenvolvimento pessoal", quantidade: 1 },
        { id: "essencialismo", titulo: "Essencialismo", autor: "Greg McKeown", preco: 44.90, imagem: "assets/img/essencialismo.jpg", categoria: "Produtividade", quantidade: 1 },
      ],
    },
    {
      id: "#NP-2026-21883",
      data: dias(45),
      status: "entregue",
      total: 149.80,
      itens: [
        { id: "python-fluente", titulo: "Python Fluente", autor: "Luciano Ramalho", preco: 89.90, imagem: "assets/img/python-fluente.jpg", categoria: "Python", quantidade: 1 },
        { id: "entendendo-algoritmos", titulo: "Entendendo Algoritmos", autor: "Aditya Bhargava", preco: 64.90, imagem: "assets/img/algoritmos.jpg", categoria: "Tecnologia", quantidade: 1 },
      ],
    },
    {
      id: "#NP-2025-77421",
      data: dias(90),
      status: "entregue",
      total: 179.70,
      itens: [
        { id: "javascript-definitivo", titulo: "JavaScript Definitivo", autor: "David Flanagan", preco: 94.90, imagem: "assets/img/javascript-definitivo.jpg", categoria: "Front-end", quantidade: 1 },
        { id: "o-hobbit", titulo: "O Hobbit", autor: "J.R.R. Tolkien", preco: 49.90, imagem: "assets/img/o-hobbit.png", categoria: "Fantasia", quantidade: 1 },
        { id: "1984", titulo: "1984", autor: "George Orwell", preco: 34.90, imagem: "assets/img/1984.jpg", categoria: "Ficção", quantidade: 1 },
      ],
    },
  ];
}

// ── Leitura / histórico de leitura ────────────────────────────────

function obterDadosLeitura() {
  const dados = JSON.parse(localStorage.getItem(LEITURA_KEY) || "{}");

  // Preenche defaults simulados se não existir
  if (!dados.registros) {
    dados.registros = {
      "clean-code": { minutos: 320, totalPaginas: 425, paginasLidas: 425, iniciado: "2026-04-10", concluido: "2026-04-25" },
      "arquitetura-limpa": { minutos: 290, totalPaginas: 432, paginasLidas: 432, iniciado: "2026-04-26", concluido: "2026-05-05" },
      "habitos-atomicos": { minutos: 210, totalPaginas: 320, paginasLidas: 320, iniciado: "2026-03-01", concluido: "2026-03-14" },
      "essencialismo": { minutos: 180, totalPaginas: 272, paginasLidas: 272, iniciado: "2026-03-15", concluido: "2026-03-24" },
      "python-fluente": { minutos: 580, totalPaginas: 792, paginasLidas: 600, iniciado: "2026-02-01", concluido: null },
      "entendendo-algoritmos": { minutos: 240, totalPaginas: 264, paginasLidas: 264, iniciado: "2026-01-20", concluido: "2026-02-01" },
      "javascript-definitivo": { minutos: 420, totalPaginas: 704, paginasLidas: 400, iniciado: "2025-12-01", concluido: null },
      "o-hobbit": { minutos: 260, totalPaginas: 336, paginasLidas: 336, iniciado: "2025-11-10", concluido: "2025-11-22" },
      "1984": { minutos: 300, totalPaginas: 416, paginasLidas: 416, iniciado: "2025-10-05", concluido: "2025-10-18" },
    };
    localStorage.setItem(LEITURA_KEY, JSON.stringify(dados));
  }

  return dados;
}

function totalMinutosLeitura() {
  const dados = obterDadosLeitura();
  return Object.values(dados.registros || {}).reduce((acc, r) => acc + (r.minutos || 0), 0);
}

function mediaMinutosSemanais() {
  const dados = obterDadosLeitura();
  const registros = Object.values(dados.registros || {});
  if (!registros.length) return 0;
  const totalSemanas = 12; // últimas 12 semanas simuladas
  return Math.round(totalMinutosLeitura() / totalSemanas);
}

// ── Favoritos ──────────────────────────────────────────────────────

function obterFavoritos() {
  return JSON.parse(localStorage.getItem(FAVORITOS_KEY) || "[]");
}

function salvarFavoritos(lista) {
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(lista));
}

function alternarFavorito(livroId) {
  const favoritos = obterFavoritos();
  const idx = favoritos.indexOf(livroId);
  if (idx === -1) {
    favoritos.push(livroId);
  } else {
    favoritos.splice(idx, 1);
  }
  salvarFavoritos(favoritos);
  return idx === -1; // true = adicionado
}

function ehFavorito(livroId) {
  return obterFavoritos().includes(livroId);
}

// ── Livros vistos recentemente ─────────────────────────────────────

function registrarLivroVisto(livroId) {
  const vistos = JSON.parse(localStorage.getItem(VISTOS_KEY) || "[]");
  const novo = [livroId, ...vistos.filter(id => id !== livroId)].slice(0, 6);
  localStorage.setItem(VISTOS_KEY, JSON.stringify(novo));
}

function obterLivrosVistos() {
  return JSON.parse(localStorage.getItem(VISTOS_KEY) || "[]");
}

// ── Helpers ────────────────────────────────────────────────────────

function obterTodosLivrosComprados(pedidos) {
  const todos = {};
  pedidos.forEach(p => p.itens.forEach(item => {
    todos[item.id] = { ...item, dataCompra: p.data, pedidoId: p.id };
  }));
  return Object.values(todos);
}

function categoriasMaisCompradas(pedidos) {
  const contagem = {};
  pedidos.forEach(p => p.itens.forEach(item => {
    contagem[item.categoria] = (contagem[item.categoria] || 0) + 1;
  }));
  return Object.entries(contagem).sort((a, b) => b[1] - a[1]);
}

function calcularNivel(livros) {
  const qtd = livros.length;
  if (qtd >= 15) return { nome: "Leitor Mestre", icone: "🏆", xp: 100, proximo: null };
  if (qtd >= 10) return { nome: "Leitor Frequente", icone: "⭐", xp: Math.round((qtd / 15) * 100), proximo: 15 };
  if (qtd >= 5) return { nome: "Leitor Dedicado", icone: "📚", xp: Math.round((qtd / 10) * 100), proximo: 10 };
  if (qtd >= 2) return { nome: "Leitor Iniciante", icone: "📖", xp: Math.round((qtd / 5) * 100), proximo: 5 };
  return { nome: "Novo Leitor", icone: "🌱", xp: Math.round((qtd / 2) * 100), proximo: 2 };
}

function statusLabel(status) {
  const map = {
    entregue: { texto: "Entregue", cor: "verde" },
    enviado: { texto: "Enviado", cor: "azul" },
    processando: { texto: "Processando", cor: "amarelo" },
    cancelado: { texto: "Cancelado", cor: "vermelho" },
  };
  return map[status] || { texto: status, cor: "cinza" };
}

function formatarMinutos(min) {
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ── Histórico de pedidos ───────────────────────────────────────────

function obterHistoricoPedidos() {
  const salvo = JSON.parse(localStorage.getItem(PEDIDOS_KEY) || "[]");
  const ultimo = JSON.parse(localStorage.getItem("nextpage-last-order") || "null");

  if (ultimo) {
    const jaSalvo = salvo.some(p => p.id === ultimo.numero);
    if (!jaSalvo) {
      const pedidoFormatado = {
        id: ultimo.numero,
        data: ultimo.data,
        status: "processando",
        total: ultimo.total,
        itens: (ultimo.itens || []).map(item => ({
          id: item.id,
          titulo: item.titulo,
          autor: item.autor || "",
          preco: item.preco,
          imagem: item.imagem || "",
          categoria: item.categoria || "Livro",
          quantidade: item.quantidade,
        })),
      };
      salvo.unshift(pedidoFormatado);
      localStorage.setItem(PEDIDOS_KEY, JSON.stringify(salvo));
    }
  }

  return salvo;
}

function obterHistoricoCompleto(usuario) {
  const salvo = obterHistoricoPedidos();
  if (salvo.length > 0) return salvo;
  return obterPedidosSimulados(usuario);
}

// ── Renderização do painel ─────────────────────────────────────────

function renderizarPainel() {
  const usuario = obterUsuarioLogado();
  if (!usuario) return;

  const pedidos = obterHistoricoCompleto(usuario);
  const livros = obterTodosLivrosComprados(pedidos);
  const nivel = calcularNivel(livros);
  const minutosTotal = totalMinutosLeitura();
  const mediaSemanais = mediaMinutosSemanais();
  const categorias = categoriasMaisCompradas(pedidos);
  const ultimoPedido = pedidos[0];
  const iniciais = usuario.nome.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  // Perfil
  document.querySelector(".avatar-conta")?.setAttribute("data-iniciais", iniciais);
  const avatarEl = document.querySelector(".avatar-conta");
  if (avatarEl) avatarEl.textContent = iniciais;
  const setTexto = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };

  setTexto(".perfil-nome", usuario.nome);
  setTexto(".perfil-email", usuario.email);
  setTexto(".perfil-nivel", `${nivel.icone} ${nivel.nome}`);
  setTexto(".perfil-data", `Membro desde ${formatarData(usuario.dataCriacao)}`);
  setTexto(".stat-pedidos", pedidos.length);
  setTexto(".stat-livros", livros.length);
  setTexto(".stat-horas", formatarMinutos(minutosTotal));
  setTexto(".stat-gasto", moedaConta.format(pedidos.reduce((s, p) => s + p.total, 0)));

  // Barra de nível
  const barra = document.querySelector(".barra-nivel-fill");
  if (barra) barra.style.width = nivel.xp + "%";
  setTexto(".nivel-xp", `${nivel.xp}% para o próximo nível`);
  if (nivel.proximo) setTexto(".nivel-proximo", `Faltam ${nivel.proximo - livros.length} livros`);

  // Dashboard cards
  setTexto(".dash-total-compras", moedaConta.format(pedidos.reduce((s, p) => s + p.total, 0)));
  setTexto(".dash-livros", livros.length);
  setTexto(".dash-ultima-compra", ultimoPedido ? ultimoPedido.data : "-");
  setTexto(".dash-categoria", categorias[0]?.[0] || "-");
  setTexto(".dash-horas-totais", formatarMinutos(minutosTotal));
  setTexto(".dash-media-semanal", formatarMinutos(mediaSemanais));

  renderizarGraficoLeitura();
  renderizarHistorico(pedidos);
  renderizarBiblioteca(livros);
  renderizarFavoritos();
  renderizarVistoRecentemente();
  renderizarConfiguracoes(usuario);
  configurarNavegacaoConta();
}

function formatarData(iso) {
  if (!iso) return "-";
  const partes = iso.split("-");
  if (partes.length === 3) {
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    return `${partes[2]} de ${meses[parseInt(partes[1]) - 1]} de ${partes[0]}`;
  }
  return iso;
}

// ── Gráfico de leitura ─────────────────────────────────────────────

function renderizarGraficoLeitura() {
  const dados = obterDadosLeitura();
  const registros = dados.registros || {};

  // Minutos por semana (últimas 8 semanas simuladas)
  const semanas = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];
  const valores = [45, 120, 80, 200, 160, 240, 180, 290];
  const max = Math.max(...valores);

  const container = document.querySelector(".grafico-leitura");
  if (!container) return;

  container.innerHTML = semanas.map((sem, i) => {
    const altura = Math.round((valores[i] / max) * 100);
    return `
      <div class="barra-grafico-wrapper">
        <div class="barra-grafico-tooltip">${formatarMinutos(valores[i])}</div>
        <div class="barra-grafico" style="height: ${altura}%" data-valor="${valores[i]}"></div>
        <span class="barra-grafico-label">${sem}</span>
      </div>
    `;
  }).join("");
}

// ── Histórico de compras ───────────────────────────────────────────

function renderizarHistorico(pedidos) {
  const lista = document.querySelector(".lista-historico");
  if (!lista) return;

  if (!pedidos.length) {
    lista.innerHTML = `<p class="estado-vazio">Nenhum pedido realizado ainda.</p>`;
    return;
  }

  lista.innerHTML = pedidos.map(pedido => {
    const st = statusLabel(pedido.status);
    const capas = pedido.itens.slice(0, 3).map(item =>
      `<img src="${item.imagem}" alt="${item.titulo}" title="${item.titulo}">`
    ).join("");
    return `
      <article class="card-pedido" data-id="${pedido.id}">
        <div class="pedido-header">
          <div class="pedido-id-data">
            <span class="pedido-id">${pedido.id}</span>
            <span class="pedido-data">📅 ${pedido.data}</span>
          </div>
          <span class="badge-status badge-${st.cor}">${st.texto}</span>
        </div>
        <div class="pedido-capas">${capas}${pedido.itens.length > 3 ? `<span class="mais-capas">+${pedido.itens.length - 3}</span>` : ""}</div>
        <div class="pedido-footer">
          <span class="pedido-livros">${pedido.itens.length} ${pedido.itens.length === 1 ? "livro" : "livros"}</span>
          <strong class="pedido-total">${moedaConta.format(pedido.total)}</strong>
        </div>
        <button class="btn-ver-pedido" data-id="${pedido.id}">Ver detalhes</button>
      </article>
    `;
  }).join("");

  lista.querySelectorAll(".btn-ver-pedido").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const pedido = pedidos.find(p => p.id === id);
      if (pedido) abrirModalPedido(pedido);
    });
  });
}

function abrirModalPedido(pedido) {
  const st = statusLabel(pedido.status);
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-caixa" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>Detalhes do Pedido</h3>
        <button class="fechar-modal" aria-label="Fechar">×</button>
      </div>
      <div class="modal-corpo">
        <div class="modal-info-pedido">
          <div><span>Pedido</span><strong>${pedido.id}</strong></div>
          <div><span>Data</span><strong>${pedido.data}</strong></div>
          <div><span>Status</span><span class="badge-status badge-${st.cor}">${st.texto}</span></div>
          <div><span>Total</span><strong>${moedaConta.format(pedido.total)}</strong></div>
        </div>
        <h4>Livros</h4>
        <div class="modal-livros">
          ${pedido.itens.map(item => `
            <div class="modal-item-livro">
              <img src="${item.imagem}" alt="${item.titulo}">
              <div>
                <strong>${item.titulo}</strong>
                <span>${item.autor}</span>
                <span>${moedaConta.format(item.preco)}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector(".fechar-modal").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
}

// ── Biblioteca do usuário ──────────────────────────────────────────

function renderizarBiblioteca(livros) {
  const grid = document.querySelector(".grid-biblioteca");
  if (!grid) return;

  const dadosLeitura = obterDadosLeitura().registros || {};

  if (!livros.length) {
    grid.innerHTML = `<p class="estado-vazio">Sua biblioteca está vazia. <a href="livros.html">Explore os livros</a>.</p>`;
    return;
  }

  grid.innerHTML = livros.map(livro => {
    const leitura = dadosLeitura[livro.id];
    const progresso = leitura ? Math.round((leitura.paginasLidas / leitura.totalPaginas) * 100) : 0;
    const concluido = leitura?.concluido;
    const isFav = ehFavorito(livro.id);

    return `
      <article class="card-biblioteca" data-id="${livro.id}">
        <div class="biblioteca-capa">
          <img src="${livro.imagem}" alt="${livro.titulo}">
          <button class="btn-favorito ${isFav ? "ativo" : ""}" data-id="${livro.id}" title="${isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}">♥</button>
          ${concluido ? '<span class="badge-concluido">✓ Lido</span>' : ""}
        </div>
        <div class="biblioteca-info">
          <span class="categoria-livro">${livro.categoria}</span>
          <h4>${livro.titulo}</h4>
          <p>${livro.autor}</p>
          ${leitura ? `
            <div class="barra-progresso-leitura">
              <div class="barra-progresso-fill" style="width:${progresso}%"></div>
            </div>
            <span class="progresso-texto">${progresso}% lido · ${formatarMinutos(leitura.minutos)}</span>
          ` : ""}
          <a href="livro.html?id=${livro.id}" class="btn-ler">Ver detalhes →</a>
        </div>
      </article>
    `;
  }).join("");

  // Favoritos nos cards da biblioteca
  grid.querySelectorAll(".btn-favorito").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const adicionado = alternarFavorito(id);
      btn.classList.toggle("ativo", adicionado);
      btn.title = adicionado ? "Remover dos favoritos" : "Adicionar aos favoritos";
      mostrarMensagem(adicionado ? "Adicionado aos favoritos!" : "Removido dos favoritos.");
      renderizarFavoritos();
    });
  });
}

// ── Favoritos ──────────────────────────────────────────────────────

function renderizarFavoritos() {
  const grid = document.querySelector(".grid-favoritos");
  if (!grid) return;

  const favoritos = obterFavoritos();
  if (!favoritos.length) {
    grid.innerHTML = `<p class="estado-vazio">Você ainda não favoritou nenhum livro. Clique no ❤️ em qualquer livro.</p>`;
    return;
  }

  grid.innerHTML = favoritos.map(id => {
    const livro = LIVROS_CATALOGO.find(l => l.id === id);
    if (!livro) return "";
    return `
      <article class="card-favorito" data-id="${id}">
        <img src="${livro.imagem}" alt="${livro.titulo}">
        <div class="favorito-info">
          <span class="categoria-livro">${livro.categoria}</span>
          <h4>${livro.titulo}</h4>
          <p>${livro.autor}</p>
          <strong>${moedaConta.format(livro.preco)}</strong>
          <div class="favorito-acoes">
            <a href="livro.html?id=${livro.id}" class="btn-ver-livro">Ver livro</a>
            <button class="btn-remover-favorito" data-id="${id}">✕</button>
          </div>
        </div>
      </article>
    `;
  }).filter(Boolean).join("");

  grid.querySelectorAll(".btn-remover-favorito").forEach(btn => {
    btn.addEventListener("click", () => {
      alternarFavorito(btn.dataset.id);
      renderizarFavoritos();
      mostrarMensagem("Removido dos favoritos.");
    });
  });
}

// ── Vistos recentemente ────────────────────────────────────────────

function renderizarVistoRecentemente() {
  const lista = document.querySelector(".lista-vistos");
  if (!lista) return;

  const vistos = obterLivrosVistos();
  const livros = vistos.map(id => LIVROS_CATALOGO.find(l => l.id === id)).filter(Boolean);

  if (!livros.length) {
    lista.innerHTML = `<p class="estado-vazio">Nenhum livro visualizado recentemente.</p>`;
    return;
  }

  lista.innerHTML = livros.map(livro => `
    <a href="livro.html?id=${livro.id}" class="card-visto">
      <img src="${livro.imagem}" alt="${livro.titulo}">
      <div>
        <strong>${livro.titulo}</strong>
        <span>${moedaConta.format(livro.preco)}</span>
      </div>
    </a>
  `).join("");
}

// ── Recomendações ──────────────────────────────────────────────────

function renderizarRecomendacoes(pedidos) {
  const lista = document.querySelector(".lista-recomendacoes");
  if (!lista) return;

  const comprados = pedidos.flatMap(p => p.itens.map(i => i.id));
  const categorias = categoriasMaisCompradas(pedidos).slice(0, 2).map(([cat]) => cat);

  const recomendados = LIVROS_CATALOGO
    .filter(l => !comprados.includes(l.id) && categorias.includes(l.categoria))
    .slice(0, 4);

  if (!recomendados.length) {
    lista.innerHTML = `<p class="estado-vazio">Explore mais categorias para receber recomendações.</p>`;
    return;
  }

  lista.innerHTML = recomendados.map(livro => `
    <a href="livro.html?id=${livro.id}" class="card-recomendado">
      <img src="${livro.imagem}" alt="${livro.titulo}">
      <div>
        <span class="categoria-livro">${livro.categoria}</span>
        <strong>${livro.titulo}</strong>
        <span>${moedaConta.format(livro.preco)}</span>
      </div>
    </a>
  `).join("");
}

// ── Configurações ──────────────────────────────────────────────────

function renderizarConfiguracoes(usuario) {
  const nomeInput = document.querySelector("#config-nome");
  const emailInput = document.querySelector("#config-email");
  if (nomeInput) nomeInput.value = usuario.nome;
  if (emailInput) emailInput.value = usuario.email;
}

function configurarFormConfiguracoes() {
  const form = document.querySelector(".form-configuracoes");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.querySelector("#config-nome")?.value.trim();
    const email = document.querySelector("#config-email")?.value.trim();
    const senhaAtual = document.querySelector("#config-senha-atual")?.value;
    const senhaNova = document.querySelector("#config-senha-nova")?.value;

    if (!nome || !email) {
      mostrarMensagem("Preencha nome e e-mail.");
      return;
    }

    const atualizado = atualizarPerfil({ nome, email });
    if (atualizado) {
      document.querySelector(".perfil-nome").textContent = nome;
      document.querySelector(".perfil-email").textContent = email;
      mostrarMensagem("Perfil atualizado com sucesso! ✓");
    }
  });

  document.querySelector(".btn-logout-conta")?.addEventListener("click", fazerLogout);
}

// ── Navegação por abas ─────────────────────────────────────────────

function configurarNavegacaoConta() {
  const abas = document.querySelectorAll(".aba-conta");
  const secoes = document.querySelectorAll(".secao-conta");

  abas.forEach(aba => {
    aba.addEventListener("click", () => {
      const alvo = aba.dataset.aba;

      abas.forEach(a => a.classList.remove("ativa"));
      secoes.forEach(s => s.classList.remove("ativa"));

      aba.classList.add("ativa");
      document.querySelector(`.secao-conta[data-secao="${alvo}"]`)?.classList.add("ativa");
    });
  });

  // Ativa por hash na URL
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const abaHash = document.querySelector(`.aba-conta[data-aba="${hash}"]`);
    abaHash?.click();
  }
}

// ── Relatório de leitura ───────────────────────────────────────────

function renderizarRelatorio() {
  const dados = obterDadosLeitura().registros || {};
  const container = document.querySelector(".relatorio-leitura");
  if (!container) return;

  const usuario = obterUsuarioLogado();
  const pedidos = obterHistoricoCompleto(usuario);
  const livros = obterTodosLivrosComprados(pedidos);
  const livrosDadosCompletos = livros.map(l => ({ ...l, leitura: dados[l.id] }));
  const concluidos = livrosDadosCompletos.filter(l => l.leitura?.concluido);
  const emAndamento = livrosDadosCompletos.filter(l => l.leitura && !l.leitura.concluido);

  const totalMin = Object.values(dados).reduce((s, r) => s + (r.minutos || 0), 0);
  const mediaMin = mediaMinutosSemanais();
  const totalPaginas = Object.values(dados).reduce((s, r) => s + (r.paginasLidas || 0), 0);

  container.innerHTML = `
    <div class="relatorio-stats">
      <div class="relatorio-stat">
        <span class="relatorio-icone">⏱️</span>
        <strong>${formatarMinutos(totalMin)}</strong>
        <span>Total de leitura</span>
      </div>
      <div class="relatorio-stat">
        <span class="relatorio-icone">📅</span>
        <strong>${formatarMinutos(mediaMin)}</strong>
        <span>Média semanal</span>
      </div>
      <div class="relatorio-stat">
        <span class="relatorio-icone">📄</span>
        <strong>${totalPaginas.toLocaleString("pt-BR")}</strong>
        <span>Páginas lidas</span>
      </div>
      <div class="relatorio-stat">
        <span class="relatorio-icone">✅</span>
        <strong>${concluidos.length}</strong>
        <span>Livros concluídos</span>
      </div>
      <div class="relatorio-stat">
        <span class="relatorio-icone">📖</span>
        <strong>${emAndamento.length}</strong>
        <span>Em andamento</span>
      </div>
      <div class="relatorio-stat">
        <span class="relatorio-icone">🔥</span>
        <strong>${Math.round(mediaMin / 60 * 7)} dias</strong>
        <span>Sequência estimada</span>
      </div>
    </div>

    <div class="relatorio-livros-lidos">
      <h4>Progresso por livro</h4>
      ${livrosDadosCompletos.filter(l => l.leitura).map(l => `
        <div class="relatorio-livro-linha">
          <img src="${l.imagem}" alt="${l.titulo}">
          <div class="relatorio-livro-dados">
            <strong>${l.titulo}</strong>
            <div class="barra-progresso-leitura">
              <div class="barra-progresso-fill" style="width:${Math.round((l.leitura.paginasLidas / l.leitura.totalPaginas) * 100)}%"></div>
            </div>
            <span class="progresso-texto">
              ${l.leitura.paginasLidas}/${l.leitura.totalPaginas} pág. ·
              ${formatarMinutos(l.leitura.minutos)} ·
              ${l.leitura.concluido ? "✅ Concluído" : "📖 Em andamento"}
            </span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// ── Inicialização ──────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  protegerPagina();

  const usuario = obterUsuarioLogado();
  if (!usuario) return;

  const pedidos = obterHistoricoCompleto(usuario);
  const livros = obterTodosLivrosComprados(pedidos);

  renderizarPainel();
  renderizarRelatorio();
  renderizarRecomendacoes(pedidos);
  configurarFormConfiguracoes();

  // Adiciona ícones de coração em todas as páginas
  configurarBotoesCoracao();
});

// ── Ícones de coração no catálogo ─────────────────────────────────

function configurarBotoesCoracao() {
  document.querySelectorAll(".card-livro").forEach(card => {
    const titulo = card.querySelector("h3")?.textContent.trim();
    if (!titulo) return;
    const livro = LIVROS_CATALOGO?.find(l => l.titulo === titulo);
    if (!livro) return;

    if (card.querySelector(".btn-coracao-catalogo")) return;

    const btn = document.createElement("button");
    btn.className = `btn-coracao-catalogo ${ehFavorito(livro.id) ? "ativo" : ""}`;
    btn.dataset.id = livro.id;
    btn.setAttribute("aria-label", "Favoritar livro");
    btn.innerHTML = "♥";
    card.appendChild(btn);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!estaLogado()) {
        mostrarMensagem("Faça login para favoritar livros.");
        return;
      }
      const adicionado = alternarFavorito(livro.id);
      btn.classList.toggle("ativo", adicionado);
      mostrarMensagem(adicionado ? "❤️ Adicionado aos favoritos!" : "Removido dos favoritos.");
    });
  });
}
