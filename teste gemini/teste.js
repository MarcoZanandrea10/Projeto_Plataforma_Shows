document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // ESTADO DA APLICAÇÃO E DADOS
    // =================================================================

    // Objeto para guardar o estado atual da compra
    let estadoDaCompra = {
        eventoId: null,
        eventoNome: null,
        setor: { nome: null, preco: 0 },
        assentos: [],
        quantidade: 1,
        servicosAdicionais: [],
        precoTotal: 0
    };

    // Dados dos eventos (simulando um banco de dados)
    const dadosEventos = [
        {
            id: 1,
            nome: "LUNARIS: Concerto Sob as Estrelas",
            artistas: ["Orquestra Filarmônica da Lua", "DJ Galáctico"],
            imagem: "https://picsum.photos/seed/lunaris/600/400",
            descricao: "Uma experiência musical única sob um céu estrelado projetado, combinando música clássica com batidas eletrônicas cósmicas.",
            data: "20/10/2025", local: "Planetário de Itajaí",
            setores: [
                { nome: "Cadeiras Cósmicas", preco: 250, tipo: "assento", totalAssentos: 40 },
                { nome: "Pista Orbital", preco: 120, tipo: "quantidade" }
            ],
            servicos: {
                "Cadeiras Cósmicas": [{ nome: "Kit Constelação (Brindes)", preco: 50 }],
                geral: [{ nome: "Estacionamento VIP", preco: 40 }]
            }
        },
        {
            id: 2,
            nome: "Aquarela Fest: O Festival das Cores",
            artistas: ["Banda Girassol", "Os Pincéis Mágicos", "DJ Tinta Fresca"],
            imagem: "https://picsum.photos/seed/aquarela/600/400",
            descricao: "Prepare-se para uma explosão de cores e música! No auge do festival, pós coloridos são lançados ao ar, criando uma aquarela humana.",
            data: "15/11/2025", local: "Parque da Cidade",
            setores: [
                { nome: "Pista das Cores", preco: 80, tipo: "quantidade" },
                { nome: "Camarote Splash", preco: 180, tipo: "assento", totalAssentos: 30 }
            ],
            servicos: {
                "Camarote Splash": [{ nome: "Open Bar de Tintas (Drink)", preco: 70 }, { nome: "Acesso ao Backstage", preco: 120 }],
                geral: [{ nome: "Kit de Pós Coloridos Extra", preco: 25 }]
            }
        },
    ];

    // =================================================================
    // FUNÇÕES DE RENDERIZAÇÃO E UI
    // =================================================================

    // Mostra uma tela específica e esconde as outras
    function navegarParaTela(idTela) {
        document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
        document.getElementById(idTela).classList.add('ativa');
        window.scrollTo(0, 0);
    }

    // Renderiza os cards de eventos na tela inicial
    function renderizarEventos() {
        const container = document.getElementById('lista-eventos-container');
        container.innerHTML = dadosEventos.map(evento => `
            <div class="card-evento" data-evento-id="${evento.id}">
                <img src="${evento.imagem}" alt="Imagem de ${evento.nome}">
                <div class="card-evento-info">
                    <h3>${evento.nome}</h3>
                    <p>${evento.artistas.join(', ')}</p>
                </div>
            </div>
        `).join('');
    }

    // Abre o modal com detalhes do evento
    function abrirModalDetalhes(eventoId) {
        const evento = dadosEventos.find(e => e.id === eventoId);
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>${evento.nome}</h3>
            <p><strong>Atrações:</strong> ${evento.artistas.join(', ')}</p>
            <p><strong>Data:</strong> ${evento.data} | <strong>Local:</strong> ${evento.local}</p>
            <p>${evento.descricao}</p>
            <h4>Setores Disponíveis</h4>
            <ul>
                ${evento.setores.map(s => `<li>${s.nome} - R$ ${s.preco.toFixed(2)}</li>`).join('')}
            </ul>
            <button class="btn-principal" id="btn-comprar-ingresso" data-evento-id="${evento.id}">Comprar Ingressos</button>
        `;
        document.getElementById('modal-detalhes').style.display = 'flex';
    }

    // Renderiza a tela de seleção de setores
    function renderizarSelecaoSetores() {
        const evento = dadosEventos.find(e => e.id === estadoDaCompra.eventoId);
        document.getElementById('titulo-evento-setores').innerText = evento.nome;
        const container = document.getElementById('selecao-setores-container');

        let htmlSetores = '<h4>Escolha o setor:</h4>';
        evento.setores.forEach(setor => {
            htmlSetores += `<p><input type="radio" name="setor" value="${setor.nome}" data-preco="${setor.preco}" data-tipo="${setor.tipo}"> ${setor.nome} (R$ ${setor.preco.toFixed(2)})</p>`;
        });
        htmlSetores += '<div id="detalhe-setor"></div>'; // Para mapa ou quantidade
        container.innerHTML = htmlSetores;
        atualizarResumoParcial();
    }
    
    // Renderiza o mapa de assentos ou seletor de quantidade
    function renderizarDetalheSetor(tipo, nomeSetor) {
        const container = document.getElementById('detalhe-setor');
        const evento = dadosEventos.find(e => e.id === estadoDaCompra.eventoId);
        const setor = evento.setores.find(s => s.nome === nomeSetor);
        
        if (tipo === 'assento') {
            let assentosHtml = '<div class="mapa-assentos">';
            for (let i = 1; i <= setor.totalAssentos; i++) {
                // Simula alguns assentos ocupados
                const isOcupado = Math.random() > 0.7 ? 'ocupado' : 'disponivel';
                assentosHtml += `<div class="assento ${isOcupado}" data-numero="${i}">${i}</div>`;
            }
            assentosHtml += '</div>';
            container.innerHTML = assentosHtml;
        } else {
            container.innerHTML = `
                <div class="seletor-quantidade">
                    <label for="quantidade-ingressos">Quantidade:</label>
                    <input type="number" id="quantidade-ingressos" value="1" min="1" max="10">
                </div>
            `;
        }
    }

    // Renderiza a tela de serviços adicionais
    function renderizarServicos() {
        const evento = dadosEventos.find(e => e.id === estadoDaCompra.eventoId);
        const servicosDisponiveis = [...(evento.servicos.geral || [])];
        if(evento.servicos[estadoDaCompra.setor.nome]) {
            servicosDisponiveis.push(...evento.servicos[estadoDaCompra.setor.nome]);
        }

        const container = document.getElementById('lista-servicos-container');
        container.innerHTML = servicosDisponiveis.map(servico => `
            <div class="servico-item">
                <input type="checkbox" id="servico-${servico.nome.replace(/\s/g, '')}" data-nome="${servico.nome}" data-preco="${servico.preco}">
                <label for="servico-${servico.nome.replace(/\s/g, '')}">${servico.nome} (+ R$ ${servico.preco.toFixed(2)})</label>
            </div>
        `).join('');
    }

    // Renderiza o resumo final do pedido
    function renderizarRevisao() {
        calcularPrecoTotal();
        const container = document.getElementById('resumo-final-container');
        let html = `
            <div class="resumo-linha"><span>Evento:</span> <strong>${estadoDaCompra.eventoNome}</strong></div>
            <div class="resumo-linha"><span>Setor:</span> <strong>${estadoDaCompra.setor.nome}</strong></div>
        `;
        if (estadoDaCompra.assentos.length > 0) {
            html += `<div class="resumo-linha"><span>Assentos:</span> <strong>${estadoDaCompra.assentos.join(', ')}</strong></div>`;
        } else {
            html += `<div class="resumo-linha"><span>Quantidade:</span> <strong>${estadoDaCompra.quantidade}</strong></div>`;
        }

        if (estadoDaCompra.servicosAdicionais.length > 0) {
            html += `<h4>Serviços Adicionais</h4>`;
            estadoDaCompra.servicosAdicionais.forEach(s => {
                html += `<div class="resumo-linha"><span>${s.nome}</span> <strong>+ R$ ${s.preco.toFixed(2)}</strong></div>`;
            });
        }
        
        html += `<hr><div class="resumo-linha total"><span>TOTAL:</span> <strong>R$ ${estadoDaCompra.precoTotal.toFixed(2)}</strong></div>`;
        container.innerHTML = html;
    }

    // Atualiza o pequeno resumo na tela de setores
    function atualizarResumoParcial() {
        calcularPrecoTotal();
        document.getElementById('resumo-setor').innerText = `Setor: ${estadoDaCompra.setor.nome || 'Nenhum selecionado'}`;
        
        let assentosTexto = '';
        if (estadoDaCompra.assentos.length > 0) {
            assentosTexto = `Assentos: ${estadoDaCompra.assentos.join(', ')}`;
        } else if(estadoDaCompra.setor.nome && estadoDaCompra.quantidade > 0) {
            assentosTexto = `Quantidade: ${estadoDaCompra.quantidade}`;
        }
        document.getElementById('resumo-assentos').innerText = assentosTexto;
        document.getElementById('resumo-preco-parcial').innerText = `Subtotal: R$ ${estadoDaCompra.precoTotal.toFixed(2)}`;
    }
    
    // Calcula o preço total com base no estado da compra
    function calcularPrecoTotal() {
        let total = 0;
        const quantidade = estadoDaCompra.assentos.length > 0 ? estadoDaCompra.assentos.length : estadoDaCompra.quantidade;
        total += estadoDaCompra.setor.preco * quantidade;
        estadoDaCompra.servicosAdicionais.forEach(s => total += s.preco);
        estadoDaCompra.precoTotal = total;
        return total;
    }

    // Valida o formulário de pagamento
    function validarPagamento() {
        // Implementação simplificada
        const numCartao = document.getElementById('num-cartao').value;
        const validade = document.getElementById('validade-cartao').value;
        const cvv = document.getElementById('cvv-cartao').value;
   
        return true;
    }

    // Reseta o estado para uma nova compra
    function resetarCompra() {
        estadoDaCompra = {
            eventoId: null, eventoNome: null,
            setor: { nome: null, preco: 0 },
            assentos: [], quantidade: 1,
            servicosAdicionais: [], precoTotal: 0
        };
    }

    // =================================================================
    // EVENT LISTENERS E LÓGICA PRINCIPAL
    // =================================================================

    // --- Navegação Geral ---
    document.querySelectorAll('.btn-voltar').forEach(btn => {
        btn.addEventListener('click', () => navegarParaTela(btn.dataset.target));
    });

    // --- Tela de Eventos ---
    document.getElementById('lista-eventos-container').addEventListener('click', (e) => {
        const card = e.target.closest('.card-evento');
        if (card) {
            abrirModalDetalhes(parseInt(card.dataset.eventoId));
        }
    });

    // --- Modal ---
    document.querySelector('.fechar-modal').addEventListener('click', () => {
        document.getElementById('modal-detalhes').style.display = 'none';
    });
    document.getElementById('modal-detalhes').addEventListener('click', (e) => {
        // Lógica para fechar modal ao clicar no overlay
        if (e.target.id === 'modal-detalhes') {
            e.target.style.display = 'none';
        }
        // Lógica para o botão de comprar
        if (e.target.id === 'btn-comprar-ingresso') {
            const eventoId = parseInt(e.target.dataset.eventoId);
            estadoDaCompra.eventoId = eventoId;
            estadoDaCompra.eventoNome = dadosEventos.find(ev => ev.id === eventoId).nome;
            document.getElementById('modal-detalhes').style.display = 'none';
            renderizarSelecaoSetores();
            navegarParaTela('tela-setores');
        }
    });

    // --- Tela de Setores ---
    document.getElementById('selecao-setores-container').addEventListener('change', (e) => {
        if (e.target.name === 'setor') {
            estadoDaCompra.setor.nome = e.target.value;
            estadoDaCompra.setor.preco = parseFloat(e.target.dataset.preco);
            estadoDaCompra.assentos = []; // Limpa assentos ao trocar de setor
            estadoDaCompra.quantidade = 1;
            renderizarDetalheSetor(e.target.dataset.tipo, e.target.value);
        }
        if(e.target.id === 'quantidade-ingressos'){
            estadoDaCompra.quantidade = parseInt(e.target.value);
        }
        atualizarResumoParcial();
    });

    document.getElementById('selecao-setores-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('assento') && e.target.classList.contains('disponivel')) {
            e.target.classList.toggle('selecionado');
            const numero = e.target.dataset.numero;
            if (e.target.classList.contains('selecionado')) {
                estadoDaCompra.assentos.push(numero);
            } else {
                estadoDaCompra.assentos = estadoDaCompra.assentos.filter(a => a !== numero);
            }
            atualizarResumoParcial();
        }
    });
    
    document.getElementById('btn-ir-para-servicos').addEventListener('click', () => {
        if (!estadoDaCompra.setor.nome) {
            alert('Por favor, selecione um setor.');
            return;
        }
        renderizarServicos();
        navegarParaTela('tela-servicos');
    });

    // --- Tela de Serviços ---
    document.getElementById('lista-servicos-container').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const nome = e.target.dataset.nome;
            const preco = parseFloat(e.target.dataset.preco);
            if (e.target.checked) {
                estadoDaCompra.servicosAdicionais.push({ nome, preco });
            } else {
                estadoDaCompra.servicosAdicionais = estadoDaCompra.servicosAdicionais.filter(s => s.nome !== nome);
            }
        }
    });

    document.getElementById('btn-ir-para-pagamento').addEventListener('click', () => {
        navegarParaTela('tela-pagamento');
    });

    // --- Tela de Pagamento ---
    document.getElementById('form-pagamento').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarPagamento()) {
            renderizarRevisao();
            navegarParaTela('tela-revisao');
        }
    });

    // --- Tela de Revisão ---
    document.getElementById('btn-confirmar-compra').addEventListener('click', () => {
        navegarParaTela('tela-confirmacao');
    });

    // --- Tela de Confirmação ---
    document.getElementById('btn-voltar-inicio').addEventListener('click', () => {
        resetarCompra();
        renderizarEventos();
        navegarParaTela('tela-eventos');
    });
    
    // --- INICIALIZAÇÃO ---
    renderizarEventos();
});