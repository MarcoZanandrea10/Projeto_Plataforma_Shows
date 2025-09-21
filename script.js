// detalhes dos eventos
const detalhes = {
    1: {
        titulo: "Rock in Rio",
        descricao:"Imagine Dragons, Iron Maiden, Ed Sheeran e muito mais!\n\n• 4 a 13 de setembro de 2026\n• Horário: 18:00\n• Local: Parque Olímpico, Rio de Janeiro, RJ\n\n<a style='font-weight: bold;'>Preços e Setores:</a>\n\n• Pista Comum: R$ 320,00\n• Cadeiras Numeradas: R$ 390,00\n• Mezaninos: R$ 500,00\n• Pista Premium: R$ 680,00\n• Camarotes: R$ 1.500,00",
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

document.querySelectorAll('.botao-detalhes').forEach((btn) => {
    btn.addEventListener('click', () => {
        const eventoId = btn.closest('.box').getAttribute('data-evento-id');
        document.getElementById('modal-titulo').textContent = detalhes[eventoId].titulo;
        document.getElementById('modal-descricao').innerHTML = detalhes[eventoId].descricao.replace(/\n/g, '<br>');
        document.getElementById('modal-detalhes').style.display = 'block';
    });
});

document.getElementById('fechar-modal').onclick = function() {
    document.getElementById('modal-detalhes').style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == document.getElementById('modal-detalhes')) {
        document.getElementById('modal-detalhes').style.display = 'none';
    }
};

// botao selecionar evento
document.querySelectorAll('.botao-selecionar').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.getElementById('tela-eventos').style.display = 'none';
        document.getElementById('tela-setores').style.display = 'block';
    });
});

// lugares com cadeiras numeradas
const setoresComLugar = ["Cadeiras Numeradas", "Camarotes"];

document.querySelectorAll('#tela-setores .box').forEach((box) => {
    box.querySelector('.botao-selecionar').addEventListener('click', () => {
        const setor = box.querySelector('h3').textContent.trim();

        if (setoresComLugar.includes(setor)) {
            // mostra tela de lugares
            document.getElementById('tela-setores').style.display = 'none';
            document.getElementById('tela-lugares').style.display = 'block';

            // gera os lugares
            const container = document.getElementById('container-lugares');
            container.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                const btn = document.createElement('button');
                btn.textContent = `L ${i}`;
                btn.className = 'botao-lugar';
                btn.onclick = function() {
                    document.querySelectorAll('.botao-lugar').forEach(b => b.classList.remove('selecionado'));
                    btn.classList.add('selecionado');
                };
                container.appendChild(btn);
            }
        } else {
            document.getElementById('tela-setores').style.display = 'none';
        }
    });
});

// botão avançar na tela de lugares
document.getElementById('botao-avancar-lugar').onclick = function() {
    const selecionado = document.querySelector('.botao-lugar.selecionado');
    if (!selecionado) {     // so permite avançar se um lugar for selecionado
        return;
    }
    document.getElementById('tela-lugares').style.display = 'none';
};

// botão voltar dos setores para eventos
document.getElementById('botao-voltar-setores').onclick = function() {
    document.getElementById('tela-setores').style.display = 'none';
    document.getElementById('tela-eventos').style.display = 'block';
};

// botão voltar dos lugares para setores
document.getElementById('botao-voltar-lugares').onclick = function() {
    document.getElementById('tela-lugares').style.display = 'none';
    document.getElementById('tela-setores').style.display = 'block';
};