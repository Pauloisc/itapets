// Mapa de fallback: ID do produto => caminho da imagem (relativo a pages/)
const PRODUTO_IMAGENS = {
  'prod_001': '../assets/img/racoes/racao-seca-cachorro-adulto-pedigree-900g.webp',
  'prod_002': '../assets/img/brinquedos/arranhador-em-torre-com-bolinha-gatos.webp',
  'prod_003': '../assets/img/brinquedos/bola-de-borracha-macica-cachorro.webp',
  'prod_004': '../assets/img/brinquedos/brinquedo-interativo-recheavel-cachorros.webp',
  'prod_005': '../assets/img/acessorios/cama-almofada-para-pets-tamanho-m.webp',
  'prod_006': '../assets/img/acessorios/escova-rasqueadeira-para-pelos.webp',
  'prod_007': '../assets/img/acessorios/guia-e-coleira-peitoral-para-cachorros.webp',
  'prod_008': '../assets/img/racoes/racao-megazoo-hamster-gerbil-300g.webp',
  'prod_009': '../assets/img/racoes/racao-seca-gatos-castrados-whiskas-10kg.webp',
  'prod_010': '../assets/img/racoes/sache-de-molho-para-caes-dog-chow-5kg.webp',
  'prod_011': '../assets/img/acessorios/shampoo-neutro-powercat-500ml.webp',
  'prod_012': '../assets/img/brinquedos/varinha-com-penas-e-chocalho-gatos.webp',
};

// Carrega do localStorage ou inicializa carrinho vazio
function obterCarrinho() {
  const dadosSalvos = localStorage.getItem('itapets_carrinho');
  if (dadosSalvos) {
    try {
      return JSON.parse(dadosSalvos);
    } catch (e) {
      console.error('Erro ao ler carrinho do localStorage:', e);
    }
  }
  return {
    carrinho_id: '1',
    usuario_id: 'usr_001',
    itens: [],
    resumo: { total_final: 0 }
  };
}

let carrinho = obterCarrinho();

// Salva o estado atual no localStorage
function salvarCarrinho() {
  localStorage.setItem('itapets_carrinho', JSON.stringify(carrinho));
}

// Inicializa eventos após o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  const botoesAdicionar = document.querySelectorAll('.btn-adicionar-carrinho');

  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', (event) => {
      const btn = event.currentTarget;

      let id     = btn.getAttribute('data-id');
      let nome   = btn.getAttribute('data-nome');
      let imagem = btn.getAttribute('data-imagem');
      let preco  = parseFloat(btn.getAttribute('data-preco'));

      // Fallback dinâmico se os data-* não estiverem preenchidos
      if (!id || !nome || isNaN(preco)) {
        const tituloEl = document.querySelector('h1.detalhes_produto');
        const precoEl  = document.querySelector('main > p');
        const imgEl    = document.querySelector('.coluna-imagem img');

        nome   = nome   || (tituloEl ? tituloEl.textContent.trim() : 'Produto');
        id     = id     || nome.toLowerCase().replace(/[^a-z0-9]/g, '-');
        imagem = imagem || (imgEl ? imgEl.getAttribute('src') : '');

        if (isNaN(preco) && precoEl) {
          const match = precoEl.textContent.match(/[\d.,]+/);
          if (match) preco = parseFloat(match[0].replace('.', '').replace(',', '.'));
        }
      }

      adicionarAoCarrinho(id, nome, preco || 0, imagem || '');

      // Feedback visual no botão
      const textoOriginal = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg"></i> Adicionado!';
      btn.classList.remove('btn-add-bi-cart');
      btn.classList.add('btn-success');

      setTimeout(() => {
        btn.innerHTML = textoOriginal;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-add-bi-cart');
      }, 1500);
    });
  });

  // Renderiza o carrinho se estiver na página carrinho.html
  renderizarCarrinhoSeExistir();
});

// Adiciona ou incrementa um item no carrinho
function adicionarAoCarrinho(id, nome, preco, imagem) {
  const itemExistente = carrinho.itens.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.quantidade += 1;
    // Atualiza a imagem caso o item antigo não tivesse
    if (!itemExistente.imagem && imagem) itemExistente.imagem = imagem;
  } else {
    carrinho.itens.push({ id, nome, preco, imagem, quantidade: 1 });
  }
  atualizarTotal();
  salvarCarrinho();
  console.log('Carrinho atualizado:', carrinho);
}

// Remove 1 unidade do item; se chegar a 0, remove o item por completo
function removerDoCarrinho(id) {
  const index = carrinho.itens.findIndex(item => item.id === id);
  if (index === -1) return;

  if (carrinho.itens[index].quantidade > 1) {
    carrinho.itens[index].quantidade -= 1;
  } else {
    carrinho.itens.splice(index, 1);
  }

  atualizarTotal();
  salvarCarrinho();
  renderizarCarrinhoSeExistir();
}

// Recalcula o total do carrinho
function atualizarTotal() {
  carrinho.resumo.total_final = carrinho.itens.reduce((total, item) => {
    return total + item.preco * item.quantidade;
  }, 0);
}

// Renderiza os itens na página carrinho.html (se existir o container)
function renderizarCarrinhoSeExistir() {
  const container = document.getElementById('carrinho-container');
  if (!container) return;

  if (carrinho.itens.length === 0) {
    container.innerHTML = '<p class="carrinho-vazio text-center py-5">Seu carrinho está vazio.</p>';
    return;
  }

  let html = `
    <div class="card p-4 shadow-sm mb-4">
      <h2 class="h4 mb-3 text-center">Seu Carrinho</h2>
      <ul class="list-group list-group-flush mb-3">
  `;

  carrinho.itens.forEach(item => {
    // Resolve imagem: usa a salva no item, ou o mapa de fallback, ou exibe cinza
    const srcImagem = item.imagem || PRODUTO_IMAGENS[item.id] || '';
    const imgTag = srcImagem
      ? `<img src="${srcImagem}" alt="${item.nome}" style="width:60px;height:60px;object-fit:contain;border-radius:6px;background:#f5f5f5;flex-shrink:0;">`
      : `<span style="width:60px;height:60px;display:inline-flex;align-items:center;justify-content:center;background:#eee;border-radius:6px;flex-shrink:0;"><i class="bi bi-image text-muted"></i></span>`;

    html += `
      <li class="list-group-item d-flex justify-content-between align-items-center py-3 gap-3">
        <div class="d-flex align-items-center gap-3 flex-grow-1">
          ${imgTag}
          <div>
            <h6 class="my-0">${item.nome}</h6>
            <small class="text-muted">Quantidade: ${item.quantidade} &times; R$ ${item.preco.toFixed(2)}</small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-3 text-nowrap">
          <span class="fw-bold">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
          <button
            type="button"
            class="btn btn-outline-danger btn-sm"
            title="Remover uma unidade"
            onclick="removerDoCarrinho('${item.id}')">
            <i class="bi bi-dash-lg"></i>
          </button>
        </div>
      </li>
    `;
  });

  html += `
      </ul>
      <div class="d-flex justify-content-between align-items-center pt-3 border-top">
        <span class="h5 mb-0">Total Final:</span>
        <strong class="h4 text-success mb-0">R$ ${carrinho.resumo.total_final.toFixed(2)}</strong>
      </div>
    </div>
  `;

  container.innerHTML = html;
}