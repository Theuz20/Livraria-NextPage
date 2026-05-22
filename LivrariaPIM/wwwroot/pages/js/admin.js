// admin.js
// Toda a lógica do painel admin da NextPage.
// Dados simulados mas estruturados pra substituir por uma API real depois.

// ── Dados simulados ──────────────────────────────────────────────

// Usuários cadastrados — mistura o demo com quem salvou pelo localStorage
function obterTodosUsuarios() {
  const cadastros = JSON.parse(localStorage.getItem("nextpage-cadastros") || "[]");

  // Usuários base pra ter sempre alguma coisa no painel
  const base = [
    { id: "usr-001", nome: "João Silva",    email: "joao@email.com",    nivel: "Leitor Frequente",  dataCriacao: "2024-03-15", pedidos: 8,  status: "ativo" },
    { id: "usr-002", nome: "Maria Souza",   email: "maria@email.com",   nivel: "Leitor Iniciante",  dataCriacao: "2024-05-20", pedidos: 3,  status: "ativo" },
    { id: "usr-003", nome: "Carlos Lima",   email: "carlos@email.com",  nivel: "Bibliófilo",        dataCriacao: "2023-11-08", pedidos: 22, status: "ativo" },
    { id: "usr-004", nome: "Ana Costa",     email: "ana@email.com",     nivel: "Leitor Frequente",  dataCriacao: "2024-01-30", pedidos: 11, status: "ativo" },
    { id: "usr-005", nome: "Pedro Oliveira",email: "pedro@email.com",   nivel: "Leitor Iniciante",  dataCriacao: "2025-02-14", pedidos: 1,  status: "inativo" },
    { id: "usr-006", nome: "Lucia Ferreira",email: "lucia@email.com",   nivel: "Leitor Frequente",  dataCriacao: "2024-07-03", pedidos: 6,  status: "ativo" },
  ];

  // Adiciona quem se cadastrou de verdade pelo localStorage
  cadastros.forEach((c, i) => {
    if (!base.find(u => u.email === c.email)) {
      base.push({
        id: c.id || `usr-real-${i}`,
        nome: c.nome,
        email: c.email,
        nivel: c.nivel || "Leitor Iniciante",
        dataCriacao: c.dataCriacao || "2025-01-01",
        pedidos: 0,
        status: "ativo",
      });
    }
  });

  return base;
}

// Pedidos simulados
const PEDIDOS = [
  { id: "PED-0041", cliente: "Carlos Lima",    livros: ["Clean Code", "Arquitetura Limpa"], total: 219.80, data: "2025-05-18", status: "entregue" },
  { id: "PED-0040", cliente: "Ana Costa",      livros: ["O Hobbit"],                        total: 49.90,  data: "2025-05-17", status: "enviado" },
  { id: "PED-0039", cliente: "João Silva",     livros: ["Python Fluente", "O Programador Pragmático"], total: 189.80, data: "2025-05-16", status: "enviado" },
  { id: "PED-0038", cliente: "Maria Souza",    livros: ["Hábitos Atômicos"],                total: 59.90,  data: "2025-05-15", status: "entregue" },
  { id: "PED-0037", cliente: "Lucia Ferreira", livros: ["1984", "Dom Casmurro"],            total: 89.80,  data: "2025-05-14", status: "entregue" },
  { id: "PED-0036", cliente: "Pedro Oliveira", livros: ["Harry Potter"],                    total: 69.90,  data: "2025-05-13", status: "cancelado" },
  { id: "PED-0035", cliente: "Carlos Lima",    livros: ["Algoritmos"],                      total: 89.90,  data: "2025-05-12", status: "entregue" },
  { id: "PED-0034", cliente: "Ana Costa",      livros: ["Pai Rico Pai Pobre"],              total: 44.90,  data: "2025-05-10", status: "processando" },
  { id: "PED-0033", cliente: "João Silva",     livros: ["JavaScript Definitivo"],           total: 109.90, data: "2025-05-08", status: "entregue" },
  { id: "PED-0032", cliente: "Maria Souza",    livros: ["Essencialismo", "Orgulho e Preconceito"], total: 99.80, data: "2025-05-05", status: "entregue" },
];

// Chamados de suporte — com status persistido no localStorage
const CHAMADOS_BASE = [
  { id: "SUP-001", titulo: "Não recebi meu pedido PED-0038", usuario: "Maria Souza", email: "maria@email.com", prioridade: "alta",  categoria: "Entrega",   data: "2025-05-19", mensagem: "Já se passaram 5 dias desde o envio e o pedido ainda não chegou. O código de rastreio não está atualizando." },
  { id: "SUP-002", titulo: "Boleto gerado mas não consegui pagar", usuario: "Pedro Oliveira", email: "pedro@email.com", prioridade: "media", categoria: "Pagamento",  data: "2025-05-18", mensagem: "O boleto foi gerado mas o banco retornou erro ao tentar pagar. Já tentei em dois bancos diferentes." },
  { id: "SUP-003", titulo: "Livro chegou com páginas faltando", usuario: "Ana Costa", email: "ana@email.com", prioridade: "alta",  categoria: "Produto",   data: "2025-05-17", mensagem: "O livro 'O Hobbit' chegou com as páginas 120 a 136 faltando. Gostaria de troca ou reembolso." },
  { id: "SUP-004", titulo: "Cupom de desconto não funcionou", usuario: "Lucia Ferreira", email: "lucia@email.com", prioridade: "baixa", categoria: "Promoção",  data: "2025-05-16", mensagem: "Tentei usar o cupom LEITURA20 mas o sistema disse que era inválido, mesmo estando dentro da validade." },
  { id: "SUP-005", titulo: "Problema ao alterar endereço de entrega", usuario: "Carlos Lima", email: "carlos@email.com", prioridade: "media", categoria: "Conta",     data: "2025-05-15", mensagem: "Não consigo alterar o endereço de entrega no meu perfil. O botão de salvar não faz nada." },
  { id: "SUP-006", titulo: "Nota fiscal não foi enviada por e-mail", usuario: "João Silva", email: "joao@email.com", prioridade: "baixa", categoria: "Financeiro", data: "2025-05-14", mensagem: "Comprei o pedido PED-0033 há uma semana e não recebi a nota fiscal. Preciso para reembolso da empresa." },
];

// Pega o status atual do localStorage (pra persistir entre reloads)
function obterChamados() {
  const salvos = JSON.parse(localStorage.getItem("nextpage-chamados-status") || "{}");
  return CHAMADOS_BASE.map(c => ({
    ...c,
    status: salvos[c.id] || "aberto",
  }));
}

function salvarStatusChamado(id, status) {
  const salvos = JSON.parse(localStorage.getItem("nextpage-chamados-status") || "{}");
  salvos[id] = status;
  localStorage.setItem("nextpage-chamados-status", JSON.stringify(salvos));
}

// Dados mensais pra o relatório
const RELATORIO_MENSAL = [
  { mes: "Dezembro/24", usuarios: 18, pedidos: 41, livros: 67, receita: 3841.20, chamados: 9,  resolvidos: 9  },
  { mes: "Janeiro/25",  usuarios: 12, pedidos: 35, livros: 52, receita: 3120.50, chamados: 7,  resolvidos: 6  },
  { mes: "Fevereiro/25",usuarios: 9,  pedidos: 28, livros: 38, receita: 2540.80, chamados: 5,  resolvidos: 5  },
  { mes: "Março/25",    usuarios: 21, pedidos: 47, livros: 74, receita: 4312.60, chamados: 11, resolvidos: 10 },
  { mes: "Abril/25",    usuarios: 16, pedidos: 39, livros: 61, receita: 3698.30, chamados: 8,  resolvidos: 7  },
  { mes: "Maio/25",     usuarios: 24, pedidos: 52, livros: 88, receita: 5120.90, chamados: 6,  resolvidos: 3  },
];

// ── Navegação entre seções ───────────────────────────────────────

let chamadoAberto = null; // guarda qual chamado está no modal

function iniciarNavegacao() {
  const botoes = document.querySelectorAll(".admin-nav-item");
  const secoes = document.querySelectorAll(".admin-secao");
  const titulo  = document.getElementById("admin-titulo");
  const sub     = document.getElementById("admin-subtitulo");

  const titulos = {
    dashboard: ["Dashboard",  "Visão geral da NextPage"],
    usuarios:  ["Usuários",   "Gerencie os usuários cadastrados"],
    pedidos:   ["Pedidos",    "Histórico e status de pedidos"],
    suporte:   ["Suporte",    "Chamados e solicitações dos clientes"],
    relatorio: ["Relatório",  "Dados consolidados da plataforma"],
  };

  botoes.forEach(btn => {
    btn.addEventListener("click", () => {
      const secao = btn.dataset.secao;

      botoes.forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");

      secoes.forEach(s => s.classList.remove("ativa"));
      document.getElementById(`secao-${secao}`)?.classList.add("ativa");

      const [t, s] = titulos[secao] || ["", ""];
      titulo.textContent = t;
      sub.textContent    = s;

      // Fecha sidebar no mobile ao navegar
      document.getElementById("sidebar").classList.remove("aberta");
    });
  });

  // Menu hamburguer no mobile
  document.getElementById("btn-menu-mobile")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("aberta");
  });
}

// ── Dashboard ───────────────────────────────────────────────────

function renderizarDashboard() {
  const usuarios = obterTodosUsuarios();
  const chamados = obterChamados();
  const abertos  = chamados.filter(c => c.status === "aberto").length;
  const receita  = PEDIDOS.reduce((acc, p) => acc + p.total, 0);
  const livros   = PEDIDOS.reduce((acc, p) => acc + p.livros.length, 0);

  document.getElementById("kpi-usuarios").textContent = usuarios.length;
  document.getElementById("kpi-pedidos").textContent  = PEDIDOS.length;
  document.getElementById("kpi-livros").textContent   = livros;
  document.getElementById("kpi-receita").textContent  = `R$ ${receita.toFixed(2).replace(".", ",")}`;
  document.getElementById("kpi-chamados").textContent = abertos;
  document.getElementById("badge-suporte").textContent = abertos;

  // Ranking: conta quantas vezes cada livro aparece nos pedidos
  const contagem = {};
  PEDIDOS.forEach(p => p.livros.forEach(l => {
    contagem[l] = (contagem[l] || 0) + 1;
  }));

  const ranking = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const medalhas = ["ouro", "prata", "bronze"];
  const lista    = document.getElementById("ranking-livros");

  lista.innerHTML = ranking.map(([titulo, vendas], i) => {
    const livro = buscarLivroPorTitulo(titulo);
    const medal = medalhas[i] || "";
    return `
      <li class="ranking-item">
        <div class="ranking-pos ${medal}">${i + 1}</div>
        <div class="ranking-info">
          <p class="ranking-titulo">${titulo}</p>
          <p class="ranking-categoria">${livro?.categoria || "—"}</p>
        </div>
        <span class="ranking-vendas">${vendas} venda${vendas > 1 ? "s" : ""}</span>
      </li>
    `;
  }).join("");

  // Atividade recente — últimas ações no sistema
  const atividades = [
    { icone: "🛒", texto: `<strong>Carlos Lima</strong> fez um novo pedido (PED-0041)`, tempo: "há 2 horas" },
    { icone: "🎧", texto: `Novo chamado aberto por <strong>Maria Souza</strong>`, tempo: "há 4 horas" },
    { icone: "👤", texto: `Novo cadastro: <strong>Lucas Mendes</strong>`, tempo: "há 6 horas" },
    { icone: "✅", texto: `Pedido <strong>PED-0037</strong> marcado como entregue`, tempo: "há 8 horas" },
    { icone: "🎧", texto: `Chamado <strong>SUP-004</strong> atualizado para "em andamento"`, tempo: "há 1 dia" },
    { icone: "🛒", texto: `<strong>Ana Costa</strong> fez um novo pedido (PED-0040)`, tempo: "há 1 dia" },
  ];

  document.getElementById("atividade-lista").innerHTML = atividades.map(a => `
    <li class="atividade-item">
      <div class="atividade-icone">${a.icone}</div>
      <div>
        <p class="atividade-texto">${a.texto}</p>
        <p class="atividade-tempo">${a.tempo}</p>
      </div>
    </li>
  `).join("");
}

// ── Usuários ────────────────────────────────────────────────────

function renderizarUsuarios(filtro = "") {
  const todos   = obterTodosUsuarios();
  const termo   = textoNormalizado(filtro);
  const tbody   = document.getElementById("tbody-usuarios");
  const vazio   = document.getElementById("vazio-usuarios");

  const filtrados = termo
    ? todos.filter(u =>
        textoNormalizado(u.nome).includes(termo) ||
        textoNormalizado(u.email).includes(termo)
      )
    : todos;

  tbody.innerHTML = filtrados.map(u => {
    const iniciais = u.nome.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
    const data     = new Date(u.dataCriacao).toLocaleDateString("pt-BR");
    return `
      <tr>
        <td>
          <div class="cell-usuario">
            <div class="mini-avatar">${iniciais}</div>
            <div>
              <p class="cell-nome">${u.nome}</p>
              <p class="cell-email-sub">${u.id}</p>
            </div>
          </div>
        </td>
        <td>${u.email}</td>
        <td>${u.nivel}</td>
        <td>${data}</td>
        <td>${u.pedidos}</td>
        <td><span class="status-badge ${u.status}">${u.status}</span></td>
        <td>
          <button class="btn-acao ver">Ver</button>
          <button class="btn-acao bloquear">${u.status === "ativo" ? "Bloquear" : "Ativar"}</button>
        </td>
      </tr>
    `;
  }).join("");

  vazio?.classList.toggle("oculto", filtrados.length > 0);
}

function iniciarBuscaUsuarios() {
  document.getElementById("busca-usuarios")?.addEventListener("input", function () {
    renderizarUsuarios(this.value);
  });
}

// ── Pedidos ─────────────────────────────────────────────────────

function renderizarPedidos(filtroStatus = "todos") {
  const tbody = document.getElementById("tbody-pedidos");

  const filtrados = filtroStatus === "todos"
    ? PEDIDOS
    : PEDIDOS.filter(p => p.status === filtroStatus);

  tbody.innerHTML = filtrados.map(p => {
    const data   = new Date(p.data).toLocaleDateString("pt-BR");
    const total  = `R$ ${p.total.toFixed(2).replace(".", ",")}`;
    const livros = p.livros.join(", ");
    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>${p.cliente}</td>
        <td title="${livros}">${p.livros.length} livro${p.livros.length > 1 ? "s" : ""}</td>
        <td><strong>${total}</strong></td>
        <td>${data}</td>
        <td><span class="status-badge ${p.status}">${p.status}</span></td>
      </tr>
    `;
  }).join("");
}

function iniciarFiltroPedidos() {
  document.getElementById("filtro-status-pedido")?.addEventListener("change", function () {
    renderizarPedidos(this.value);
  });
}

// ── Suporte ─────────────────────────────────────────────────────

function renderizarSuporteKPIs() {
  const chamados  = obterChamados();
  const aberto    = chamados.filter(c => c.status === "aberto").length;
  const andamento = chamados.filter(c => c.status === "andamento").length;
  const resolvido = chamados.filter(c => c.status === "resolvido").length;

  document.getElementById("suporte-aberto").textContent    = aberto;
  document.getElementById("suporte-andamento").textContent = andamento;
  document.getElementById("suporte-resolvido").textContent = resolvido;
  document.getElementById("badge-suporte").textContent     = aberto;
  document.getElementById("kpi-chamados").textContent      = aberto;
}

function renderizarChamados(filtro = "todos") {
  const chamados  = obterChamados();
  const lista     = document.getElementById("chamados-lista");

  const filtrados = filtro === "todos"
    ? chamados
    : chamados.filter(c => c.status === filtro);

  lista.innerHTML = filtrados.map(c => `
    <div class="chamado-item" data-id="${c.id}">
      <div class="chamado-prioridade ${c.prioridade}" title="Prioridade ${c.prioridade}"></div>
      <div class="chamado-info">
        <p class="chamado-titulo">${c.titulo}</p>
        <p class="chamado-sub">${c.usuario} · ${c.categoria}</p>
      </div>
      <div class="chamado-meta">
        <span class="status-badge ${c.status}">${c.status === "andamento" ? "em andamento" : c.status}</span>
        <span class="chamado-data">${new Date(c.data).toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  `).join("");

  // Clique em cada chamado abre o modal de detalhe
  lista.querySelectorAll(".chamado-item").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      const chamado = obterChamados().find(c => c.id === id);
      if (chamado) abrirModalChamado(chamado);
    });
  });
}

function iniciarFiltroSupporte() {
  document.getElementById("filtro-suporte")?.addEventListener("change", function () {
    renderizarChamados(this.value);
  });
}

// ── Modal de chamado ─────────────────────────────────────────────

function abrirModalChamado(chamado) {
  chamadoAberto = chamado;

  document.getElementById("modal-chamado-titulo").textContent = chamado.id + " — " + chamado.titulo;
  document.getElementById("modal-status-select").value = chamado.status;

  document.getElementById("modal-chamado-body").innerHTML = `
    <div class="modal-linha"><strong>Usuário</strong><span>${chamado.usuario}</span></div>
    <div class="modal-linha"><strong>E-mail</strong><span>${chamado.email}</span></div>
    <div class="modal-linha"><strong>Categoria</strong><span>${chamado.categoria}</span></div>
    <div class="modal-linha"><strong>Prioridade</strong><span>${chamado.prioridade}</span></div>
    <div class="modal-linha"><strong>Data</strong><span>${new Date(chamado.data).toLocaleDateString("pt-BR")}</span></div>
    <div class="modal-linha"><strong>Status atual</strong><span><span class="status-badge ${chamado.status}">${chamado.status}</span></span></div>
    <div class="modal-mensagem">${chamado.mensagem}</div>
  `;

  document.getElementById("modal-chamado").classList.remove("oculto");
}

function iniciarModal() {
  document.getElementById("modal-fechar")?.addEventListener("click", () => {
    document.getElementById("modal-chamado").classList.add("oculto");
    chamadoAberto = null;
  });

  document.getElementById("modal-chamado")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add("oculto");
      chamadoAberto = null;
    }
  });

  document.getElementById("btn-salvar-status")?.addEventListener("click", () => {
    if (!chamadoAberto) return;

    const novoStatus = document.getElementById("modal-status-select").value;
    salvarStatusChamado(chamadoAberto.id, novoStatus);

    // Atualiza tudo sem recarregar
    renderizarSuporteKPIs();
    renderizarChamados(document.getElementById("filtro-suporte").value);
    renderizarDashboard();

    document.getElementById("modal-chamado").classList.add("oculto");
    chamadoAberto = null;

    mostrarMensagem("Status do chamado atualizado!", "sucesso");
  });
}

// ── Relatório ────────────────────────────────────────────────────

function renderizarRelatorio() {
  // Vendas por categoria
  const contagem = {};
  PEDIDOS.forEach(p => p.livros.forEach(titulo => {
    const livro = buscarLivroPorTitulo(titulo);
    const cat   = livro?.categoria || "Outros";
    contagem[cat] = (contagem[cat] || 0) + 1;
  }));

  const max      = Math.max(...Object.values(contagem));
  const catOrdem = Object.entries(contagem).sort((a, b) => b[1] - a[1]);

  document.getElementById("relatorio-categorias").innerHTML = catOrdem.map(([cat, total]) => `
    <li class="categoria-item">
      <span class="categoria-nome">${cat}</span>
      <div class="categoria-barra-wrap">
        <div class="categoria-barra" style="width:${Math.round((total / max) * 100)}%"></div>
      </div>
      <span class="categoria-total">${total}</span>
    </li>
  `).join("");

  // Indicadores de suporte
  const chamados   = obterChamados();
  const total      = chamados.length;
  const resolvidos = chamados.filter(c => c.status === "resolvido").length;
  const taxaRes    = Math.round((resolvidos / total) * 100);
  const abertos    = chamados.filter(c => c.status === "aberto").length;

  document.getElementById("indicadores-suporte").innerHTML = `
    <div class="indicador-item">
      <span class="indicador-label">Total de chamados</span>
      <span class="indicador-valor">${total}</span>
    </div>
    <div class="indicador-item">
      <span class="indicador-label">Resolvidos</span>
      <span class="indicador-valor bom">${resolvidos}</span>
    </div>
    <div class="indicador-item">
      <span class="indicador-label">Em aberto</span>
      <span class="indicador-valor ${abertos > 3 ? "ruim" : "atencao"}">${abertos}</span>
    </div>
    <div class="indicador-item">
      <span class="indicador-label">Taxa de resolução</span>
      <span class="indicador-valor ${taxaRes >= 70 ? "bom" : taxaRes >= 40 ? "atencao" : "ruim"}">${taxaRes}%</span>
    </div>
    <div class="indicador-item">
      <span class="indicador-label">Prioridade alta em aberto</span>
      <span class="indicador-valor ${chamados.filter(c => c.prioridade === "alta" && c.status !== "resolvido").length > 0 ? "ruim" : "bom"}">${chamados.filter(c => c.prioridade === "alta" && c.status !== "resolvido").length}</span>
    </div>
  `;

  // Tabela mensal
  document.getElementById("tbody-relatorio").innerHTML = RELATORIO_MENSAL.map(m => `
    <tr>
      <td><strong>${m.mes}</strong></td>
      <td>${m.usuarios}</td>
      <td>${m.pedidos}</td>
      <td>${m.livros}</td>
      <td><strong>R$ ${m.receita.toFixed(2).replace(".", ",")}</strong></td>
      <td>${m.chamados}</td>
      <td><span class="status-badge ${m.resolvidos === m.chamados ? "entregue" : "enviado"}">${m.resolvidos}/${m.chamados}</span></td>
    </tr>
  `).join("");
}

// ── Exportar CSV ─────────────────────────────────────────────────

function iniciarExportarCSV() {
  document.getElementById("btn-exportar")?.addEventListener("click", () => {
    const linhas = [
      ["Mês", "Novos usuários", "Pedidos", "Livros vendidos", "Receita", "Chamados", "Resolvidos"],
      ...RELATORIO_MENSAL.map(m => [m.mes, m.usuarios, m.pedidos, m.livros, m.receita.toFixed(2), m.chamados, m.resolvidos])
    ];

    const csv  = linhas.map(l => l.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = "relatorio-nextpage.csv";
    link.click();
    URL.revokeObjectURL(url);

    mostrarMensagem("CSV exportado!", "sucesso");
  });
}

// ── Data no header ───────────────────────────────────────────────

function exibirData() {
  const agora = new Date();
  const opts  = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
  document.getElementById("admin-data").textContent =
    agora.toLocaleDateString("pt-BR", opts);
}

// ── Inicialização ────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  exibirData();
  iniciarNavegacao();

  renderizarDashboard();
  renderizarUsuarios();
  iniciarBuscaUsuarios();
  renderizarPedidos();
  iniciarFiltroPedidos();
  renderizarSuporteKPIs();
  renderizarChamados();
  iniciarFiltroSupporte();
  renderizarRelatorio();
  iniciarModal();
  iniciarExportarCSV();
});
