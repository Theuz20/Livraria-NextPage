// admin-auth.js
// Proteção de acesso ao painel administrativo.
// Exibe um overlay de login antes de revelar qualquer conteúdo do admin.

const ADMIN_KEY = "nextpage-admin-sessao";

// ── Credenciais do admin ───────────────────────────────────────────
// Para alterar, mude os valores abaixo.
const ADMIN_CREDENCIAIS = {
  usuario: "admin",
  senha: "nextpage@2025",
};

// ── Verificação de sessão ──────────────────────────────────────────

function adminEstaLogado() {
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

function adminFazerLogin(usuario, senha) {
  if (usuario === ADMIN_CREDENCIAIS.usuario && senha === ADMIN_CREDENCIAIS.senha) {
    sessionStorage.setItem(ADMIN_KEY, "true");
    return true;
  }
  return false;
}

function adminFazerLogout() {
  sessionStorage.removeItem(ADMIN_KEY);
  window.location.reload();
}

// ── Overlay de login ───────────────────────────────────────────────

function criarOverlayLogin() {
  const overlay = document.createElement("div");
  overlay.id = "admin-login-overlay";
  overlay.innerHTML = `
    <div class="admin-login-box">
      <div class="admin-login-logo">Next<span>Page</span> <em>Admin</em></div>
      <h2>Acesso restrito</h2>
      <p>Insira suas credenciais para continuar.</p>
      <div class="admin-login-campo">
        <label for="adm-usuario">Usuário</label>
        <input type="text" id="adm-usuario" placeholder="admin" autocomplete="username" />
      </div>
      <div class="admin-login-campo">
        <label for="adm-senha">Senha</label>
        <input type="password" id="adm-senha" placeholder="••••••••" autocomplete="current-password" />
      </div>
      <div class="admin-login-erro" id="adm-erro" style="display:none;">Usuário ou senha incorretos.</div>
      <button id="adm-btn-entrar">Entrar no painel</button>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #admin-login-overlay {
      position: fixed;
      inset: 0;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
    }
    .admin-login-box {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 18px;
      padding: 40px 36px;
      width: 100%;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .admin-login-logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: #f8fafc;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    .admin-login-logo span { color: #2563eb; }
    .admin-login-logo em {
      font-style: normal;
      font-size: 0.7rem;
      font-weight: 700;
      background: #2563eb;
      color: #fff;
      padding: 2px 8px;
      border-radius: 20px;
      vertical-align: middle;
      margin-left: 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .admin-login-box h2 {
      color: #f1f5f9;
      font-size: 1.25rem;
      margin: 18px 0 6px;
    }
    .admin-login-box p {
      color: #94a3b8;
      font-size: 0.88rem;
      margin-bottom: 28px;
    }
    .admin-login-campo {
      text-align: left;
      margin-bottom: 16px;
    }
    .admin-login-campo label {
      display: block;
      color: #cbd5e1;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .admin-login-campo input {
      width: 100%;
      padding: 11px 14px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      color: #f1f5f9;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .admin-login-campo input:focus { border-color: #2563eb; }
    .admin-login-erro {
      background: #450a0a;
      border: 1px solid #7f1d1d;
      color: #fca5a5;
      border-radius: 8px;
      padding: 9px 14px;
      font-size: 0.84rem;
      margin-bottom: 16px;
    }
    #adm-btn-entrar {
      width: 100%;
      padding: 12px;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 4px;
    }
    #adm-btn-entrar:hover { background: #1d4ed8; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  setTimeout(() => document.getElementById("adm-usuario")?.focus(), 50);

  function tentarEntrar() {
    const usuario = document.getElementById("adm-usuario").value.trim();
    const senha = document.getElementById("adm-senha").value;
    const erro = document.getElementById("adm-erro");

    if (adminFazerLogin(usuario, senha)) {
      overlay.remove();
      style.remove();
    } else {
      erro.style.display = "block";
      document.getElementById("adm-senha").value = "";
      document.getElementById("adm-senha").focus();
    }
  }

  document.getElementById("adm-btn-entrar").addEventListener("click", tentarEntrar);
  document.getElementById("adm-senha").addEventListener("keydown", (e) => {
    if (e.key === "Enter") tentarEntrar();
  });
  document.getElementById("adm-usuario").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("adm-senha").focus();
  });
}

// ── Botão de logout no painel ──────────────────────────────────────

function adicionarBotaoLogoutAdmin() {
  const logo = document.querySelector(".admin-logo");
  if (!logo) return;

  const btn = document.createElement("button");
  btn.textContent = "Sair";
  btn.title = "Sair do painel admin";
  btn.style.cssText = `
    margin-top: 8px;
    padding: 5px 14px;
    background: transparent;
    border: 1px solid #475569;
    border-radius: 8px;
    color: #94a3b8;
    font-size: 0.78rem;
    cursor: pointer;
    display: block;
    width: 100%;
    transition: all 0.2s;
  `;
  btn.addEventListener("mouseover", () => { btn.style.borderColor = "#ef4444"; btn.style.color = "#ef4444"; });
  btn.addEventListener("mouseout", () => { btn.style.borderColor = "#475569"; btn.style.color = "#94a3b8"; });
  btn.addEventListener("click", adminFazerLogout);
  logo.appendChild(btn);
}

// ── Inicialização ──────────────────────────────────────────────────

(function () {
  if (!adminEstaLogado()) {
    document.body.style.visibility = "hidden";
    document.addEventListener("DOMContentLoaded", () => {
      document.body.style.visibility = "visible";
      criarOverlayLogin();
    });
  } else {
    document.addEventListener("DOMContentLoaded", adicionarBotaoLogoutAdmin);
  }
})();
