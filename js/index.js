'use strict';

// Variáveis globais;
const wrapperTarefa = document.querySelector('#wrapper-tarefa')
const textTarefa = document.querySelector('#text-tarefa');
const btnEnviar = document.querySelector('#btn-enviar');
const btnLimpar = document.querySelector('#btn-limpar');
const modal = document.querySelector('#modal');
const btnExcluir = document.querySelector('#btn-excluir');
const btnCancelar = document.querySelector('#btn-cancelar');

let index;
let status;


/** Banco de Dados LocalStorage
 * 
 */
const banco2 = () => {
    window.localStorage.setItem('db-tarefas', 'dados')
}

/** Banco de Dados Local;
 * modelo temporário que será substituido pelo BD LocalStorage do navegador.
 */
let banco = [
    {tarefa: 'Estudar JavaScript', status: ''},
    {tarefa: 'Estudar Inglês', status: ''},
    {tarefa: 'Estudar Java', status: 'checked'}
];

/** Acesso ao BD
 * Essa função recebe a tarefa vinda do usuário e adiciona no inicio do array/BD o nome da tarefa e o seu status.
 * @param {*} tarefa Nome da tarefa inserida pelo usuário
 * @param {*} status Status da tarefa. Por padrão sempre vazio
 */
function setBanco(tarefa, status) {
    // banco.push({tarefa: tarefa, status: status}); // Adiciona ao final da lista;
    banco.unshift({tarefa: tarefa, status: status}); // Adiciona ao inicio da lista;
}

/** Pegando os dados do BD
 * Essa função acessa o BD e faz a leitura dos dados.
 * A cada loop ele adiciona os dados dentro da função criarTarefa() passando os itens como parametros.
 * Ele também envia a parametro index que mostra o indice do item, dessa forma consigo diferenciar os itens da Array/BD pelo seu indice.
 */
function getBanco() {
    banco.forEach((item, index) => {
        criarEstruturaTarefa(item.tarefa, item.status, index);
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
 const criarEstruturaTarefa = (tarefa, status, index) => {
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
 * Essa função padroniza o texto e verifica se algo foi digitado no campo, depois chama o setBanco() passando o parametro vindo da caixa de input da tela, que por sua vez salva essa informação no BD.
 * Depois limpa o BD para evitar duplicidade de dados.
 * Depois pega as informação do BD, que ao mesmo tempo cria a estrutura HTML.
 * Por fim, limpa o texto na caixa do input na tela.
 */
 function enviarTarefa() {
    let texto = textTarefa.value.trim().toLowerCase();
    if(texto.length > 0) {
        setBanco(texto, '');
        limparHTML();
        getBanco();
        limpaTexto();
    }
}


/** Função limpar lista do HTML
 * Essa função evita duplicidade da lista na tela.
 * Sem ela, toda vez que a função getBanco() é chamada ele duplica a estrutura HTML na tela.
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

/** Função excluir
 * Recebe o parametro index, limpa o HTML para não haver duplicidade na tela. Acessa o BD usando o indice para remover o item desejado.
 * Por fim, puxa os itens do BD mostrando na tela já com a atualização.
 * 
 * @param {*} index Parametro que vem de uma variável global. Essa variável vem o evento de click no elemento que pega o valor do atributo data-index.
 */
function excluir(index) {
    limparHTML();
    banco.splice(index, 1);
    getBanco();
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
        modal.classList.add('active'); // Se p click for no botão, chama o modal.

    } else if(event.target.localName == 'input') {
        // Se o click for no checkbox, verifica se ele já está marcado. E salva o status em uma variável global.
        if(event.target.checked) {
            status = 'checked'; // Se não estiver, marca.
        } else {
            status = ''; // Se estiver, desmarca.
        }
        banco[index].status = status; // Atualiza o banco com o novo status usando o indice como parametro.
    }
});
btnCancelar.addEventListener('click', () => {
    modal.classList.remove('active');
});
btnExcluir.addEventListener('click', () => {
    excluir(index);
    modal.classList.remove('active');
});

// Iniciador do código;
getBanco();