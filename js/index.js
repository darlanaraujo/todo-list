
const criarTarefa = (tarefa) => {
    const itemHTML = document.createElement('label'); // Crio na memoria um item pai;
    itemHTML.classList.add('lista-tarefa'); // Adiciona a classe para os estilos;

    itemHTML.innerHTML = `
        <input class="checkbox" type="checkbox">
        <p class="texto">${tarefa}</p>
        <button class="btn-fechar">X</button>
    ` // Adiciono o conteúdo HTML dentro do item criado;

    document.querySelector('#wrapper-tarefa').appendChild(itemHTML); // Adiciono o item na forma de um bloco dentro do DOM;
}