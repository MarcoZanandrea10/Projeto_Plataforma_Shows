const detalhes = {
    1: {
        titulo: "Rock in Rio",
        descricao: "bla bla bla"
    },
    2: {
        titulo: "Tomorrowland Brasil",
        descricao: "bla bla bla"
    },
    3: {
        titulo: "Lollapalooza",
        descricao: "bla bla bla"
    }
};

document.querySelectorAll('.botao-detalhes').forEach((btn) => {
    btn.addEventListener('click', () => {
        const eventoId = btn.closest('.box-evento').getAttribute('data-evento-id');
        document.getElementById('modal-titulo').textContent = detalhes[eventoId].titulo;
        document.getElementById('modal-descricao').textContent = detalhes[eventoId].descricao;
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