/**
 * checkout.js — NextPage Livraria
 * ─────────────────────────────────────────────────────────────────
 * Renderização do checkout, validações de formulário, máscaras
 * de input e renderização da página de pedido confirmado.
 * Depende de: utils.js, carrinho.js
 * ─────────────────────────────────────────────────────────────────
 */

// ─── Renderização do checkout ─────────────────────────────────────

/**
 * Renderiza o resumo do pedido na sidebar do checkout.
 * Registra o evento de confirmação com validações.
 */
function renderizarCheckout() {
  const resumo = document.querySelector(".resumo-checkout");
  if (!resumo) return;

  const carrinho = lerCarrinho();
  const { subtotal, frete, desconto, total } = calcularTotais(carrinho);

  resumo.innerHTML = `
    <h2>Resumo do pedido</h2>

    ${carrinho.length > 0
      ? carrinho.map(criarItemResumo).join("")
      : "<p class='checkout-vazio'>Nenhum item no carrinho.</p>"
    }

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

    <a class="botao-confirmar-pedido ${carrinho.length === 0 ? "desabilitado" : ""}" href="pedido-confirmado.html">
      Confirmar pedido
    </a>

    <p class="mensagem-segura">Pagamento protegido e dados criptografados.</p>
  `;

  // Evento de confirmação do pedido
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

    // Salva o pedido e limpa o carrinho
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

// ─── Renderização do pedido confirmado ───────────────────────────

/**
 * Renderiza os detalhes do pedido na página de confirmação.
 * Lê os dados salvos pelo checkout via localStorage.
 */
function renderizarPedidoConfirmado() {
  const pagina = document.querySelector(".pagina-confirmacao");
  if (!pagina) return;

  const pedido = JSON.parse(localStorage.getItem(ORDER_KEY));
  if (!pedido) return;

  // Detalhes do pedido (número, data, total, etc.)
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

  // Lista de livros comprados
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

// ─── Validações de formulário ────────────────────────────────────

/**
 * Valida todos os formulários do checkout.
 * Verifica também a validade do cartão de crédito.
 * @returns {boolean}
 */
function validarFormulariosCheckout() {
  const formularios = document.querySelectorAll(".pagina-checkout form");
  const validade    = document.querySelector(".pagina-checkout #validade");

  if (validade) {
    const ehValida = validadeCartaoEhAtualOuFutura(validade.value);
    validade.setCustomValidity(ehValida ? "" : "A validade deve ser igual ou posterior a 05/26.");
  }

  for (const formulario of formularios) {
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return false;
    }
  }

  return true;
}

/**
 * Verifica se a validade do cartão é presente ou futura.
 * @param {string} valor — Formato MM/AA
 * @returns {boolean}
 */
function validadeCartaoEhAtualOuFutura(valor) {
  const resultado = valor.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!resultado) return false;

  const mes          = Number(resultado[1]);
  const ano          = 2000 + Number(resultado[2]);
  const dataMinima   = new Date(2026, 4, 1);
  const dataInformada = new Date(ano, mes - 1, 1);

  return dataInformada >= dataMinima;
}

// ─── Máscaras de input ────────────────────────────────────────────

/**
 * Remove caracteres não alfabéticos (exceto espaços) de um input.
 * @param {HTMLInputElement} input
 */
function manterSomenteLetras(input) {
  input.value = input.value.replace(/[^\p{L}\s]/gu, "");
}

/**
 * Remove não-dígitos e limita o comprimento de um input numérico.
 * @param {HTMLInputElement} input
 * @param {number} limite
 */
function manterSomenteNumeros(input, limite) {
  input.value = input.value.replace(/\D/g, "").slice(0, limite);
}

/**
 * Aplica a máscara de validade de cartão (MM/AA).
 * @param {HTMLInputElement} input
 */
function formatarValidade(input) {
  const numeros = input.value.replace(/\D/g, "").slice(0, 4);
  input.value   = numeros.length > 2 ? `${numeros.slice(0, 2)}/${numeros.slice(2)}` : numeros;
}

/**
 * Aplica a máscara de CEP (00000-000).
 * @param {HTMLInputElement} input
 */
function formatarCep(input) {
  const numeros = input.value.replace(/\D/g, "").slice(0, 8);
  input.value   = numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros;
}

/**
 * Aplica a máscara de CPF (000.000.000-00).
 * @param {HTMLInputElement} input
 */
function formatarCpf(input) {
  const numeros = input.value.replace(/\D/g, "").slice(0, 11);
  input.value   = numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

/**
 * Valida o formato de e-mail.
 * @param {string} valor
 * @returns {boolean}
 */
function emailEhValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
}

// ─── Configurações de eventos ─────────────────────────────────────

/**
 * Registra validações e máscaras nos campos específicos do checkout.
 */
function configurarValidacoesCheckout() {
  const pagina = document.querySelector(".pagina-checkout");
  if (!pagina) return;

  // Campos que aceitam apenas letras
  ["#nome", "#cidade", "#titular"].forEach((seletor) => {
    const input = pagina.querySelector(seletor);
    input?.addEventListener("input", () => manterSomenteLetras(input));
  });

  // Campos que aceitam apenas números com limite de caracteres
  [
    ["#numero", 12],
    ["#cartao", 16],
    ["#cvv", 3],
    ["#telefone", 11],
  ].forEach(([seletor, limite]) => {
    const input = pagina.querySelector(seletor);
    input?.addEventListener("input", () => manterSomenteNumeros(input, limite));
  });

  // CPF com máscara
  const cpf = pagina.querySelector("#cpf");
  cpf?.addEventListener("input", () => formatarCpf(cpf));

  // CEP com máscara
  const cep = pagina.querySelector("#cep");
  cep?.addEventListener("input", () => formatarCep(cep));

  // E-mail com validação customizada
  const email = pagina.querySelector("#email");
  email?.addEventListener("input", () => {
    email.setCustomValidity(
      !email.value || emailEhValido(email.value)
        ? ""
        : "Digite um e-mail valido, como nome@dominio.com."
    );
  });

  // Validade do cartão: máscara + validação no blur
  const validade = pagina.querySelector("#validade");
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

/**
 * Registra máscaras globais para campos comuns em qualquer página
 * (email, telefone, CPF, CEP — fora do checkout).
 */
function configurarMascarasGerais() {
  document.querySelectorAll("input[type='email']").forEach((email) => {
    email.addEventListener("input", () => {
      email.setCustomValidity(
        !email.value || emailEhValido(email.value)
          ? ""
          : "Digite um e-mail valido, como nome@dominio.com."
      );
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

/**
 * Configura seleção visual de opções de entrega e métodos de pagamento.
 */
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
