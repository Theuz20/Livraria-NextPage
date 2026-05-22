// detalhes.js
// Cuida da página de detalhe de um livro (livro.html).
// Pega o ?id= da URL, busca no catálogo e preenche tudo na página.
// Depende de: utils.js, catalogo.js

// Renderiza a página do livro com os dados do catálogo.
// Se o ID não existir ou não vier na URL, carrega o Clean Code como padrão.
function renderizarDetalheLivroDinamico() {
  const paginaDetalhe = document.querySelector(".pagina-detalhe");
  if (!paginaDetalhe) return;

  const parametros = new URLSearchParams(window.location.search);
  const livro = buscarLivroPorId(parametros.get("id")) || buscarLivroPorId("clean-code");

  // Pega todos os elementos da página que vão receber dados do livro
  const elementos = {
    capa:           paginaDetalhe.querySelector(".capa-detalhe img"),
    badge:          paginaDetalhe.querySelector(".badge-detalhe"),
    categoria:      paginaDetalhe.querySelector(".conteudo-detalhe .categoria-livro"),
    titulo:         paginaDetalhe.querySelector(".conteudo-detalhe h1"),
    autor:          paginaDetalhe.querySelector(".autor-detalhe"),
    avaliacao:      paginaDetalhe.querySelector(".avaliacao-detalhe"),
    descricaoCurta: paginaDetalhe.querySelector(".descricao-curta"),
    preco:          paginaDetalhe.querySelector(".preco-detalhe"),
    parcelamento:   paginaDetalhe.querySelector(".parcelamento-detalhe"),
    blocoDescricao: paginaDetalhe.querySelector(".bloco-descricao"),
    ficha:          paginaDetalhe.querySelector(".ficha-tecnica dl"),
  };

  // Atualiza o título da aba do navegador com o nome do livro
  document.title = `${livro.titulo} | NextPage`;

  // Capa do livro
  if (elementos.capa) {
    elementos.capa.src = livro.imagem;
    elementos.capa.alt = `Capa do livro ${livro.titulo}`;
  }

  // Informações básicas
  if (elementos.badge)     elementos.badge.textContent     = livro.badge;
  if (elementos.categoria) elementos.categoria.textContent = livro.categoria;
  if (elementos.titulo)    elementos.titulo.textContent    = livro.titulo;
  if (elementos.autor)     elementos.autor.textContent     = livro.autor;

  // Bloco de avaliação com estrelas
  if (elementos.avaliacao) {
    elementos.avaliacao.innerHTML = `
      <span>★★★★★</span>
      <strong>${escaparHtml(livro.avaliacao)}</strong>
      <p>${escaparHtml(livro.avaliacoes)}</p>
    `;
  }

  // Descrição curta que aparece acima do preço
  if (elementos.descricaoCurta) elementos.descricaoCurta.textContent = livro.descricao;

  // Preço formatado e opção de parcelamento
  if (elementos.preco)        elementos.preco.textContent        = moeda.format(livro.preco);
  if (elementos.parcelamento) elementos.parcelamento.textContent = livro.parcelamento;

  // Seção "Sobre o livro" com os parágrafos do catálogo
  if (elementos.blocoDescricao) {
    elementos.blocoDescricao.innerHTML = `
      <h2>Sobre o livro</h2>
      ${livro.sobre.map((paragrafo) => `<p>${escaparHtml(paragrafo)}</p>`).join("")}
    `;
  }

  // Ficha técnica com os dados completos do livro
  if (elementos.ficha) {
    elementos.ficha.innerHTML = `
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

// Registra o livro como visualizado recentemente ao carregar a página de detalhe
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id && typeof registrarLivroVisto === "function") {
    registrarLivroVisto(id);
  }
});
