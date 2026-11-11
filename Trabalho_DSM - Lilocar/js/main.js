// JavaScript Auxiliar para Interatividade do Carrinho e Formulário

document.addEventListener('DOMContentLoaded', function() {
  let totalItens = 0;
  const contadorBadge = document.getElementById('contadorCarrinho');

  // 1. Contador simples de itens no carrinho ao clicar em "Adicionar"
  const botoesComprar = document.querySelectorAll('.btn-comprar');
  botoesComprar.forEach(function(botao) {
    botao.addEventListener('click', function() {
      totalItens++;
      if (contadorBadge) {
        contadorBadge.textContent = totalItens;
      }
      const nomeProduto = this.getAttribute('data-nome') || 'Produto';
      alert('"' + nomeProduto + '" foi adicionado ao carrinho!');
    });
  });

  // 2. Filtro simples por Busca e Categoria ocultando/exibindo as DIVs do HTML 
  const inputBusca = document.getElementById('inputBusca');
  const selectCategoria = document.getElementById('selectCategoria');
  const cardItems = document.querySelectorAll('.card-item');

  function filtrarProdutosHTML() {
    if (!inputBusca || !selectCategoria) return;
    
    const termo = inputBusca.value.toLowerCase().trim();
    const categoria = selectCategoria.value;

    cardItems.forEach(function(card) {
      const nomeCard = card.getAttribute('data-nome') || '';
      const catCard = card.getAttribute('data-categoria') || '';

      const bateNome = nomeCard.includes(termo);
      const bateCat = (categoria === '' || catCard === categoria);

      if (bateNome && bateCat) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (inputBusca && selectCategoria) {
    inputBusca.addEventListener('input', filtrarProdutosHTML);
    selectCategoria.addEventListener('change', filtrarProdutosHTML);

    // Parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const catUrl = params.get('cat');
    const buscaUrl = params.get('busca');

    if (catUrl) {
      selectCategoria.value = catUrl;
    }
    if (buscaUrl) {
      inputBusca.value = buscaUrl;
    }
    filtrarProdutosHTML();
  }

  // 3. Validação formulário de contato
  const formContato = document.getElementById('formContato');
  if (formContato) {
    formContato.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!formContato.checkValidity()) {
        formContato.classList.add('was-validated');
        return;
      }
      
      // Abre modal se o Bootstrap estiver disponível
      if (window.bootstrap && bootstrap.Modal) {
        const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'));
        modalSucesso.show();
      } else {
        alert('Mensagem enviada com sucesso!');
      }

      formContato.reset();
      formContato.classList.remove('was-validated');
    });
  }
});
