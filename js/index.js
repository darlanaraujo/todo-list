'use strict';

// Variáveis globais;
const btnEnviar = document.querySelector('#btn-enviar');
const textTarefa = document.querySelector('#text-tarefa');
const btnLimpar = document.querySelector('#btn-limpar');

/** Banco de Dados Local;
 * modelo temporário que será substituido pelo BD LocalStorage do navegador.
 */
let banco = [
    {tarefa: 'Estudar JavaScript', status: ''},
    {tarefa: 'Estudar Inglês', status: ''},
    {tarefa: 'Estudar Java', status: 'checked'}
];

/** Acesso ao BD
 * Essa função recebe a tarefa vinda do usuário e adiciona ao BD o nome da tarefa e o seu status
 * @param {*} tarefa Nome da tarefa inserida pelo usuário
 * @param {*} status Status da tarefa. Por padrão sempre vazio
 */
function setBanco(tarefa, status='') {
    banco.push({tarefa: tarefa, status: status});
}

/** Pegando os dados do BD
 * Essa função acessa o BD e faz a leitura dos dados.
 * A cada loop ele adiciona os dados dentro da função criarTarefa() passando os itens como parametros.
 */
function getBanco() {
    banco.forEach((item) => {
        criarEstruturaTarefa(item.tarefa, item.status);
    });
}

// const getBanco = () => {
//     banco.forEach((item) => criarTarefa(item.tarefa, item.status));
// }

/** Função limpar lista do BD
 * Essa função evita duplicidade da lista do BD.
 * Sem ela, toda vez que a função getBanco() é chamada ele duplica a lista do BD.
 * Ela acessa o elemento pai aonde estão os elementos label com os itens da tarefa.
 * Faz um loop por esse elemento pai buscando item por item dentro dele, e eliminando cada item encontrado.
 */
function limparBD() {
    const wrapperTarefa = document.querySelector('#wrapper-tarefa');

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

/** Função enviar tarefa
 * Essa função chama o setBanco() passando o parametro vindo da caixa de input da tela, que por sua vez salva essa informação no BD.
 * Depois limpa o BD para evitar duplicidade de dados.
 * Depois pega as informação do BD, que ao mesmo tempo cria a estrutura HTML.
 * Por fim, limpa o texto na caixa do input na tela.
 */
function enviarTarefa() {
    setBanco(textTarefa.value, '');
    limparBD();
    getBanco();
    limpaTexto();
}

/** Construtor do HTML
 * A função cria em uma variável um elemento (label) que vai ser o elemento pai de outros elementos HTML.
 * Depois de criado esse elemento recebe a classe que define o estilo CSS.
 * Por fim, ele recebe o conteúdo HTML, com os elementos e classes já definidos.
 * @param {*} tarefa recebe o texto inserido pelo usuário na interface.
 * @param {*} status Se preenchido (checked) ele habilita a estilização CSS para mostrar a tarefa como marcada.
 */
const criarEstruturaTarefa = (tarefa, status) => {
    const itemHTML = document.createElement('label'); // Crio na memoria um item pai;
    itemHTML.classList.add('lista-tarefa'); // Adiciona a classe para os estilos;

    itemHTML.innerHTML = `
        <input class="checkbox" type="checkbox" ${status}>
        <p class="texto">${tarefa}</p>
        <button class="btn-fechar">X</button>
    ` // Adiciono o conteúdo HTML dentro do item criado;

    document.querySelector('#wrapper-tarefa').appendChild(itemHTML); // Adiciono o item na forma de um bloco dentro do DOM;
}

// Comandos dos botões
btnEnviar.addEventListener('click', enviarTarefa);
btnLimpar.addEventListener('click', limpaTexto);


// Iniciador do código;
getBanco();