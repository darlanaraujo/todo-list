'use strict';

// Variáveis globais;
const wrapperTarefa = document.querySelector('#wrapper-tarefa')
const textTarefa = document.querySelector('#text-tarefa');
const btnEnviar = document.querySelector('#btn-enviar');
const btnLimpar = document.querySelector('#btn-limpar');
const modal = document.querySelector('#modal');
const btnExcluir = document.querySelector('#btn-excluir');
const btnCancelar = document.querySelector('#btn-cancelar');

let index; // Recebe o indice que vem da tela
let status; // Recebe o status que vem da tela
let bancoTemp = getBanco(); // Recebe o banco que vem do navegador;

/** Funçãp que retorna o BD em um Array.
 * Recebe o endereço do BD que vem do navegador (LocalStorage), e converte o arquivo para um Array.
 */
function getBanco() {
    return JSON.parse(localStorage.getItem('bd-tarefas')) ?? [];
}

/** Envia dado ao Banco de Dados LocalStorage
 * Essa função recebe um parametro no formado de Array, que é convertido para String e enviado para o BD do navegador (LocalStorage).
 * @param {*} banco Recebe um Array; 
 */
function setBanco(banco) {
    localStorage.setItem('bd-tarefas', JSON.stringify(banco));
}

/** Função que adiciona os dados da tela para o Array
 * Essa função recebe doi parametros que são strings vindas da tela (nome da terefa e seu status).
 * Ela adiciona esses parametros no inicio do Array que está na variável bancoTemp.
 * Por fim, ele joga esse Array para dentro da função que converte o Array para String.
 * 
 * @param {*} tarefa Nome da tarefa que vem da tela
 * @param {*} status Status da tarefa que vem da tela
 */
function setDados(tarefa, status) {
    bancoTemp.unshift({tarefa: tarefa, status: status});
    setBanco(bancoTemp);
}

/** Função que monta os dados do BD e joga para estrutura HTML
 * Essa função acessa a função getBanco() que vem no formato de Array, percorre os dados ao mesmo tempo que monta esses dados na estrutura HTML usando a função criarEstruturaHTML
 */
function getDados() {
    getBanco().forEach((item, index) => {
        criarEstruturaHTML(item.tarefa, item.status, index);
    });
}

/** Construtor do HTML
 * A função cria em uma variável um elemento (label) que vai ser o elemento pai de outros elementos HTML.
 * Depois de criado esse elemento recebe a classe que define o estilo CSS.
 * Por fim, ele recebe o conteúdo HTML, com os elementos e classes já definidos.
 * @param {*} tarefa recebe o texto inserido pelo usuário na interface.
 * @param {*} status Se preenchido (checked) ele habilita a estilização CSS para mostrar a tarefa como marcada.
 * @param {*} index Mostra qual é o indice do item em relação ao Array/BD.
 */
 const criarEstruturaHTML = (tarefa, status, index) => {
    const itemHTML = document.createElement('label'); // Crio na memoria um item pai;
    itemHTML.classList.add('lista-tarefa'); // Adiciona a classe para os estilos;

    itemHTML.innerHTML = `
        <input class="checkbox" type="checkbox" ${status} data-index=${index}>
        <p class="texto">${tarefa}</p>
        <button class="btn-fechar" data-index=${index}>X</button>
    ` // Adiciono o conteúdo HTML dentro do item criado;

    wrapperTarefa.appendChild(itemHTML); // Adiciono o item na forma de um bloco dentro do DOM;
}

/** Função enviar tarefa
 * Essa função padroniza o texto e verifica se algo foi digitado no campo, depois chama o setDados() passando o parametro vindo da caixa de input da tela, que por sua vez salva essa informação no BD.
 * Depois limpa o HTML para evitar duplicidade de dados.
 * Depois pega as informação do BD, que ao mesmo tempo cria a estrutura HTML.
 * Por fim, limpa o texto na caixa do input na tela.
 */
 function enviarTarefa() {
    let texto = textTarefa.value.trim().toLowerCase();
    if(texto.length > 0) {
        setDados(texto, '');
        limparHTML();
        getDados();
        limpaTexto();
    }
}


/** Função limpar lista do HTML
 * Essa função evita duplicidade da lista na tela.
 * Sem ela, toda vez que a função getDados() é chamada ele duplica a estrutura HTML na tela.
 * Ela acessa o elemento pai aonde estão os elementos label com os itens da tarefa.
 * Faz um loop por esse elemento pai buscando item por item dentro dele, e eliminando cada item encontrado.
 */
function limparHTML() {
    while(wrapperTarefa.firstChild) {
        wrapperTarefa.removeChild(wrapperTarefa.lastChild);
    }
}

/** Função limpar texto
 * Essa função limpa o texto que estiver na caixa do input aonde o usuário digita o nome da tarefa.
 * Ela é utilizada pelo botão limpar texto e pela função enviarTarefa().
 */
function limpaTexto() {
    textTarefa.value = '';
}

/** Função que habilita o modal na tela
 * Essa função adiciona a classe active na estrutura HTML. Essa classe habilita a estilização CCS que por sua vez monta a tela do modal.
 */
function setModal() {
    modal.classList.add('active');
}

/** Função excluir
 * Recebe o parametro index, limpa o HTML para não haver duplicidade na tela. Acessa a variavel que contem o BD no formato de Array, usando o indice para remover o item desejado.
 * Depois passa esse Array com a atualização para a função setBanco().
 * Por fim, puxa os itens do BD mostrando na tela já com a atualização.
 * 
 * @param {*} index Parametro que vem de uma variável global. Essa variável vem do evento de click no elemento que pega o valor do atributo data-index.
 */
function excluirItem(index) {
    limparHTML();
    bancoTemp.splice(index, 1);
    setBanco(bancoTemp);
    getDados();
}

/** Função atualizar item
 * Essa função recebe como parametro o index do objeto clicado na tela. Esse indice define a sua posição dentro do Array.
 * Usando esse idice como guia a variavel que contem o BD muda o status que é definido por uma condição e depois atualizado o BD. 
 * @param {*} index Parametro que vem de uma variável global. Essa variável vem do evento de click no elemento que pega o valor do atributo data-index.
 */
function atualizarItem(index) {
    bancoTemp[index].status = status;
    setBanco(bancoTemp);
}


// Eventos
btnEnviar.addEventListener('click', enviarTarefa);
btnLimpar.addEventListener('click', limpaTexto);
textTarefa.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        enviarTarefa(); // Envia a tarefa apertando Enter
    } else if (event.key === 'Escape') {
        limpaTexto(); // Limpa o texto apertando Esc.
    }
});
wrapperTarefa.addEventListener('click', (event) => {
    index = event.target.dataset.index; // Salva o indice do elemento clicado em uma variável global;

    if(event.target.localName == 'button') {
         setModal(); // Se o click for no botão, chama o modal.

    } else if(event.target.localName == 'input') {
        // Se o click for no checkbox, verifica se ele já está marcado. E salva o status em uma variável global.
        if(event.target.checked) {
            status = 'checked'; // Se não estiver, marca.
        } else {
            status = ''; // Se estiver, desmarca.
        }
        atualizarItem(index) // Atualiza o banco com o novo status usando o indice como parametro.
    }
});
btnCancelar.addEventListener('click', () => {
    modal.classList.remove('active');
});
btnExcluir.addEventListener('click', () => {
    excluirItem(index);
    modal.classList.remove('active');
});

// Iniciador do código;
getDados();