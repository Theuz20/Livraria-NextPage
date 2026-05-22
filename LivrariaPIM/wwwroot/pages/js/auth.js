// auth.js
// Módulo de autenticação da NextPage.
// Gerencia sessão, login simulado e proteção de páginas.

const AUTH_KEY = "nextpage-usuario";
const SESSION_KEY = "nextpage-sessao";

// Usuário demo para desenvolvimento
const USUARIO_DEMO = {
  id: "usr-001",
  nome: "João Silva",
  email: "joao@email.com",
  senha: "123456",
  dataCriacao: "2024-03-15",
  avatar: null,
  nivel: "Leitor Frequente",
};

// ── Funções de sessão ──────────────────────────────────────────────

function obterUsuarioLogado() {
  const dados = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
  return dados ? JSON.parse(dados) : null;
}

function estaLogado() {
  return obterUsuarioLogado() !== null;
}

function salvarSessao(usuario, lembrar = false) {
  const storage = lembrar ? localStorage : sessionStorage;
  storage.setItem(AUTH_KEY, JSON.stringify(usuario));
}

function fazerLogout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}

// ── Login simulado ─────────────────────────────────────────────────

function tentarLogin(email, senha, lembrar) {
  // Aceita o usuário demo ou qualquer cadastro salvo
  const cadastros = JSON.parse(localStorage.getItem("nextpage-cadastros") || "[]");
  let usuario = cadastros.find(u => u.email === email && u.senha === senha);

  if (!usuario && email === USUARIO_DEMO.email && senha === USUARIO_DEMO.senha) {
    usuario = USUARIO_DEMO;
  }

  if (!usuario) return false;

  const perfil = {
    id: usuario.id || `usr-${Date.now()}`,
    nome: usuario.nome,
    email: usuario.email,
    dataCriacao: usuario.dataCriacao || new Date().toISOString().split("T")[0],
    nivel: usuario.nivel || "Leitor Iniciante",
    avatar: usuario.avatar || null,
    lembrar,
  };

  salvarSessao(perfil, lembrar);
  return true;
}

// ── Cadastro simulado ──────────────────────────────────────────────

function registrarUsuario(dados) {
  const cadastros = JSON.parse(localStorage.getItem("nextpage-cadastros") || "[]");
  const jaExiste = cadastros.some(u => u.email === dados.email);
  if (jaExiste) return { sucesso: false, mensagem: "E-mail já cadastrado." };

  const novo = {
    ...dados,
    id: `usr-${Date.now()}`,
    dataCriacao: new Date().toISOString().split("T")[0],
    nivel: "Leitor Iniciante",
  };
  cadastros.push(novo);
  localStorage.setItem("nextpage-cadastros", JSON.stringify(cadastros));
  return { sucesso: true };
}

// ── Atualizar perfil ───────────────────────────────────────────────

function atualizarPerfil(campos) {
  const usuario = obterUsuarioLogado();
  if (!usuario) return false;

  const atualizado = { ...usuario, ...campos };
  const lembrar = !!localStorage.getItem(AUTH_KEY);
  salvarSessao(atualizado, lembrar);

  // Atualiza também no cadastro
  const cadastros = JSON.parse(localStorage.getItem("nextpage-cadastros") || "[]");
  const idx = cadastros.findIndex(u => u.id === usuario.id);
  if (idx !== -1) {
    cadastros[idx] = { ...cadastros[idx], ...campos };
    localStorage.setItem("nextpage-cadastros", JSON.stringify(cadastros));
  }

  return true;
}

// ── Proteção de página ─────────────────────────────────────────────

function protegerPagina() {
  if (!estaLogado()) {
    window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.pathname.split("/").pop());
  }
}

// ── Navbar dinâmica ────────────────────────────────────────────────

function atualizarNavbarAuth() {
  const linkLogin = document.querySelector(".link-login");
  if (!linkLogin) return;

  if (estaLogado()) {
    const usuario = obterUsuarioLogado();
    const iniciais = usuario.nome.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

    linkLogin.href = "minha-conta.html";
    linkLogin.innerHTML = `
      <span class="avatar-nav">${iniciais}</span>
      <span class="nome-nav">${usuario.nome.split(" ")[0]}</span>
    `;
    linkLogin.classList.add("link-usuario-logado");
  } else {
    linkLogin.href = "login.html";
    linkLogin.textContent = "Login";
    linkLogin.classList.remove("link-usuario-logado");
  }
}

// Inicializa automaticamente
document.addEventListener("DOMContentLoaded", atualizarNavbarAuth);
