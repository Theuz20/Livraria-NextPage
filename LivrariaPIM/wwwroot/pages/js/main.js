// main.js
// Ponto de entrada do projeto. Chama tudo que precisa inicializar depois que o DOM carrega.
//
// Ordem dos scripts no HTML (importante não mudar):
//   1. utils.js      — funções utilitárias gerais
//   2. catalogo.js   — dados dos livros e funções de busca
//   3. carrinho.js   — lógica do carrinho
//   4. checkout.js   — checkout e validações
//   5. livros.js     — cards, filtros e formulários
//   6. detalhes.js   — página de detalhe do livro
//   7. pesquisa.js   — pesquisa dinâmica e redirecionamento
//   8. main.js       — inicialização (esse aqui)

document.addEventListener("DOMContentLoaded", () => {

  // Página de detalhe do livro (livro.html)
  // Pega o ?id= da URL e popula a página com os dados do catálogo
  renderizarDetalheLivroDinamico();

  // Corrige os links de categorias e coleções nas páginas que têm isso
  atualizarLinksCategorias();

  // Configura o clique nos cards e o botão "Ver detalhes"
  configurarCardsLivros();

  // Botões "Adicionar ao carrinho" em qualquer página
  configurarBotoesAdicionar();

  // Atualiza o número do carrinho no header
  atualizarContadorCarrinho();

  // Renderiza os itens do carrinho (só roda em carrinho.html)
  renderizarCarrinho();

  // Resumo e confirmação do pedido (só roda em checkout.html)
  renderizarCheckout();

  // Validações e máscaras específicas do checkout
  configurarValidacoesCheckout();

  // Opções de entrega e formas de pagamento
  configurarOpcoesSelecionaveis();

  // Máscaras de campo em qualquer página (CPF, CEP, telefone, etc.)
  configurarMascarasGerais();

  // Formulários de login, cadastro e contato
  configurarFormularios();

  // Filtros por categoria em livros.html
  configurarFiltrosLivros();

  // Página de pedido confirmado
  renderizarPedidoConfirmado();

});
