document.addEventListener('DOMContentLoaded', () => {

    // --- ESTADO DA APLICAÇÃO E DADOS ---
    const selecaoUsuario = {
        evento: null,
        setor: null,
        lugar: null,
        servicos: []
    };

    const detalhesEventos = {
        1: {
            titulo: "Rock in Rio",
            descricao: "Imagine Dragons, Iron Maiden, Ed Sheeran e muito mais!\n\n• 4 a 13 de setembro de 2026\n• Horário: 18:00\n• Local: Parque Olímpico, Rio de Janeiro, RJ\n\n<a style='font-weight: bold;'>Preços e Setores:</a>\n\n• Pista Comum: R$ 320,00\n• Cadeiras Numeradas: R$ 390,00\n• Mezaninos: R$ 500,00\n• Pista Premium: R$ 680,00\n• Camarotes: R$ 1.500,00",
        },
        2: {
            titulo: "Tomorrowland Brasil",
            descricao: "Alok, Vintage Culture, David Guetta e muito mais!\n\n• 10 a 12 de outubro de 2025\n• Horário: 16:00\n• Local: Parque Maeda - Itu/SP\n\n<a style='font-weight: bold;'>Preços e Setores:</a>\n\n• Pista Comum: R$ 320,00\n• Cadeiras Numeradas: R$ 390,00\n• Mezaninos: R$ 500,00\n• Pista Premium: R$ 680,00\n• Camarotes: R$ 1.500,00"
        },
        3: {
            titulo: "Lollapalooza",
            descricao: "Sabrina Carpenter, Deftones, Lorde, Tyler e muito mais!\n\n• 20 a 22 de março de 2026\n• Horário: 18:00\n• Autódromo de Interlagos - São Paulo/SP\n\n<a style='font-weight: bold;'>Preços e Setores:</a>\n\n• Pista Comum: R$ 320,00\n• Cadeiras Numeradas: R$ 390,00\n• Mezaninos: R$ 500,00\n• Pista Premium: R$ 680,00\n• Camarotes: R$ 1.500,00"
        }
    };
    const setoresComLugarMarcado = ["Cadeiras Numeradas", "Camarotes"];

    // --- FUNÇÕES PRINCIPAIS ---
    function atualizarBarraDeProgresso(etapaAtual) {
        const etapas = document.querySelectorAll('.etapa-item');
        etapas.forEach((etapa, index) => {
            etapa.classList.toggle('ativa', index < etapaAtual);
        });
    }

    function navegarParaTela(idTela) {
        document.querySelectorAll('.tela').forEach(tela => tela.style.display = 'none');
        const telaParaExibir = document.getElementById(idTela);
        telaParaExibir.style.display = (idTela === 'tela-eventos' || idTela === 'tela-setores') ? 'grid' : 'block';
    }

    function gerarBotoesDeLugar() {
        const container = document.getElementById('container-lugares');
        container.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const btnLugar = document.createElement('button');
            btnLugar.textContent = `L ${i}`;
            btnLugar.className = 'botao-lugar';
            btnLugar.addEventListener('click', () => {
                document.querySelectorAll('.botao-lugar').forEach(b => b.classList.remove('selecionado'));
                btnLugar.classList.add('selecionado');
                selecaoUsuario.lugar = btnLugar.textContent;
            });
            container.appendChild(btnLugar);
        }
    }

    function atualizarResumoPedido() {
        const containerResumo = document.getElementById('resumo-pedido');
        if (!containerResumo) return;

        let total = 0;
        const itens = [];

        if (selecaoUsuario.setor) {
            const precoSetor = parseFloat(selecaoUsuario.setor.preco);
            const quantidade = selecaoUsuario.setor.quantidade || 1;
            const totalSetor = precoSetor * quantidade;
            total += totalSetor;
            itens.push(`<li><span>${selecaoUsuario.setor.nome} (x${quantidade})</span> <span>R$ ${totalSetor.toFixed(2)}</span></li>`);
        }

        if (selecaoUsuario.servicos && selecaoUsuario.servicos.length > 0) {
            itens.push(`<li><strong>Serviços:</strong></li>`);
            selecaoUsuario.servicos.forEach(servico => {
                const precoServico = parseFloat(servico.preco);
                total += precoServico;
                itens.push(`<li><span>- ${servico.nome}</span> <span>R$ ${precoServico.toFixed(2)}</span></li>`);
            });
        }

        containerResumo.innerHTML = `
            <p><strong>Evento:</strong> ${selecaoUsuario.evento.nome}</p>
            <ul>${itens.join('')}</ul>
            <div class="total">
                <span>TOTAL</span>
                <span>R$ ${total.toFixed(2)}</span>
            </div>
        `;
    }

    // --- MODAL DE DETALHES ---
    document.querySelectorAll('.botao-detalhes').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventoId = btn.closest('.box').getAttribute('data-evento-id');
            document.getElementById('modal-titulo').textContent = detalhesEventos[eventoId].titulo;
            document.getElementById('modal-descricao').innerHTML = detalhesEventos[eventoId].descricao.replace(/\n/g, '<br>');
            document.getElementById('modal-detalhes').style.display = 'block';
        });
    });

    document.getElementById('fechar-modal').addEventListener('click', () => document.getElementById('modal-detalhes').style.display = 'none');
    window.addEventListener('click', e => {
        if (e.target == document.getElementById('modal-detalhes')) {
            document.getElementById('modal-detalhes').style.display = 'none';
        }
    });

    // --- BOTÕES DE AVANÇAR ---
    document.querySelectorAll('.botao-selecionar-evento').forEach(btn => {
        btn.addEventListener('click', () => {
            const box = btn.closest('.box');
            selecaoUsuario.evento = {
                id: box.getAttribute('data-evento-id'),
                nome: box.querySelector('h2').textContent
            };
            atualizarBarraDeProgresso(2);
            navegarParaTela('tela-setores');
        });
    });

    document.querySelectorAll('.botao-selecionar-setor').forEach(btn => {
        btn.addEventListener('click', () => {
            const box = btn.closest('.box');
            const seletorQuantidade = box.querySelector('.seletor-quantidade');
            const quantidade = parseInt(seletorQuantidade.value, 10);

            if (!quantidade || quantidade < 1) {
                return alert('Por favor, selecione uma quantidade válida de ingressos.');
            }

            selecaoUsuario.setor = {
                nome: box.getAttribute('data-setor-nome'),
                preco: box.getAttribute('data-setor-preco'),
                quantidade: quantidade
            };

            if (setoresComLugarMarcado.includes(selecaoUsuario.setor.nome)) {
                gerarBotoesDeLugar();
                navegarParaTela('tela-lugares');
            } else {
                selecaoUsuario.lugar = null;
                atualizarBarraDeProgresso(3);
                navegarParaTela('tela-servicos');
            }
        });
    });

    document.getElementById('botao-avancar-lugar').addEventListener('click', () => {
        if (!selecaoUsuario.lugar) {
            return alert('Por favor, selecione um lugar para continuar.');
        }
        atualizarBarraDeProgresso(3);
        navegarParaTela('tela-servicos');
    });

    document.getElementById('botao-avancar-servicos').addEventListener('click', () => {
        selecaoUsuario.servicos = [];
        document.querySelectorAll('input[name="servico"]:checked').forEach(checkbox => {
            selecaoUsuario.servicos.push({
                nome: checkbox.value,
                preco: checkbox.dataset.preco
            });
        });
        atualizarBarraDeProgresso(4);
        atualizarResumoPedido();
        navegarParaTela('tela-pagamento');
    });

    document.getElementById('botao-finalizar-pagamento').addEventListener('click', () => {
        const formValido = ['num-cartao', 'nome-cartao', 'validade-cartao', 'cvv-cartao'].every(id => document.getElementById(id).value);
        if (!formValido) {
            return alert('Por favor, preencha todos os dados do cartão.');
        }
        atualizarBarraDeProgresso(5);
        navegarParaTela('tela-revisao');
    });

    // --- BOTÕES DE "VOLTAR" ---
    document.getElementById('botao-voltar-setores').addEventListener('click', () => {
        atualizarBarraDeProgresso(1);
        navegarParaTela('tela-eventos');
    });

    document.getElementById('botao-voltar-lugares').addEventListener('click', () => {
        selecaoUsuario.lugar = null;
        atualizarBarraDeProgresso(2);
        navegarParaTela('tela-setores');
    });

    document.getElementById('botao-voltar-servicos').addEventListener('click', () => {
        const telaAnterior = setoresComLugarMarcado.includes(selecaoUsuario.setor.nome) ? 'tela-lugares' : 'tela-setores';
        navegarParaTela(telaAnterior);
        atualizarBarraDeProgresso(2);
    });

    document.getElementById('botao-voltar-pagamento').addEventListener('click', () => {
        atualizarBarraDeProgresso(3);
        navegarParaTela('tela-servicos');
    });

    // --- INICIALIZAÇÃO ---
    navegarParaTela('tela-eventos');
    atualizarBarraDeProgresso(1);

});