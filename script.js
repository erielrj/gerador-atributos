// Função para rolar 4d6 e somar os 3 maiores valores
function rolar4d6() {
    let rolls = [];
    for (let i = 0; i < 4; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => b - a); // Ordena em ordem decrescente
    return rolls[0] + rolls[1] + rolls[2]; // Soma os 3 maiores
}

let rolagens = 0;

// Função para gerar uma rolagem completa de atributos (6 atributos)
function gerarAtributos() {
    let tabela = document.getElementById('tabela-atributos');

    // Verifica se todas as colunas estão preenchidas
    let todasColunasPreenchidas = true;
    for (let i = 0; i < 3; i++) {
        let colunas = tabela.querySelectorAll(`td:nth-child(${i + 1})`);
        if (Array.from(colunas).some(coluna => coluna.textContent === '-')) {
            todasColunasPreenchidas = false; // Se encontrar uma coluna não preenchida
            break;
        }
    }

    if (todasColunasPreenchidas) {
        alert("Todas as colunas já estão preenchidas! Você não pode gerar mais atributos.");
        // Bloqueia o botão de gerar atributos
        document.getElementById('gerar-atributos').disabled = true;
        return; // Não gera novos atributos
    }

    // Encontra a próxima coluna disponível
    let colunaIndex = -1;
    for (let i = 0; i < 3; i++) {
        let colunas = tabela.querySelectorAll(`td:nth-child(${i + 1})`);
        if (Array.from(colunas).some(coluna => coluna.textContent === '-')) {
            colunaIndex = i;
            break;
        }
    }

    let colunas = tabela.querySelectorAll(`td:nth-child(${colunaIndex + 1})`);
    let total = 0;

    // Limpa a coluna antes de preencher
    colunas.forEach(coluna => {
        coluna.textContent = '-'; // Reseta a coluna
    });

    colunas.forEach((coluna, i) => {
        let valor = rolar4d6();
        coluna.textContent = valor;
        total += valor;
    });

    colunas[colunas.length - 1].dataset.total = total; // Guarda o total de cada coluna
    rolagens++;

    // Armazenar os dados no localStorage
    salvarNoLocalStorage();

    // Destaca a coluna com o maior total após a geração de atributos
    destacarMaiorColuna();

    // Verifica novamente se todas as colunas estão preenchidas para habilitar ou desabilitar o botão
    todasColunasPreenchidas = true;
    for (let i = 0; i < 3; i++) {
        let colunas = tabela.querySelectorAll(`td:nth-child(${i + 1})`);
        if (Array.from(colunas).some(coluna => coluna.textContent === '-')) {
            todasColunasPreenchidas = false;
            break;
        }
    }

    // Bloqueia o botão se todas as colunas estão preenchidas
    document.getElementById('gerar-atributos').disabled = todasColunasPreenchidas;
}

// Função para destacar a coluna com o maior valor total
function destacarMaiorColuna() {
    let tabela = document.getElementById('tabela-atributos');
    let totais = [];

    for (let i = 1; i <= 3; i++) {
        let colunas = tabela.querySelectorAll(`td:nth-child(${i})`);
        let total = Array.from(colunas).reduce((acc, coluna) => acc + parseInt(coluna.textContent), 0);
        totais.push(total);
    }

    let maiorTotal = Math.max(...totais);
    let indiceMaiorColuna = totais.indexOf(maiorTotal) + 1;

    // Armazena o índice da coluna com a maior soma no localStorage
    localStorage.setItem('maiorColuna', indiceMaiorColuna);

    // Remove a classe highlight de todas as colunas antes de destacar a nova
    let colunas = tabela.querySelectorAll('td');
    colunas.forEach(coluna => {
        coluna.classList.remove('highlight');
    });

    let colunasParaDestacar = tabela.querySelectorAll(`td:nth-child(${indiceMaiorColuna})`);
    colunasParaDestacar.forEach(coluna => {
        coluna.classList.add('highlight');
    });
}

// Função para salvar os dados da tabela no localStorage
function salvarNoLocalStorage() {
    let tabela = document.getElementById('tabela-atributos');
    let dados = [];

    for (let i = 0; i < 6; i++) {
        let linha = Array.from(tabela.rows[i].cells).map(cell => cell.textContent);
        dados.push(linha);
    }

    localStorage.setItem('atributosD&D', JSON.stringify(dados));
}

// Função para carregar os dados do localStorage
function carregarDoLocalStorage() {
    let dados = localStorage.getItem('atributosD&D');
    let maiorColuna = localStorage.getItem('maiorColuna');

    if (dados) {
        dados = JSON.parse(dados);
        let tabela = document.getElementById('tabela-atributos');

        dados.forEach((linha, i) => {
            linha.forEach((valor, j) => {
                tabela.rows[i].cells[j].textContent = valor;
            });
        });

        // Atualiza o número de rolagens baseado no conteúdo
        rolagens = dados[0].some(cell => cell !== '-') ? 3 : 0; 

        // Se a coluna com a maior soma foi armazenada, destacá-la
        if (maiorColuna) {
            destacarMaiorColuna(); // Chamada para destacar a maior coluna
        }
    }

    // Verifica se todas as colunas estão preenchidas ao carregar os dados
    let todasColunasPreenchidas = true;
    for (let i = 0; i < 3; i++) {
        let colunas = tabela.querySelectorAll(`td:nth-child(${i + 1})`);
        if (Array.from(colunas).some(coluna => coluna.textContent === '-')) {
            todasColunasPreenchidas = false; // Se encontrar uma coluna não preenchida
            break;
        }
    }

    // Bloqueia o botão se todas as colunas estão preenchidas
    document.getElementById('gerar-atributos').disabled = todasColunasPreenchidas;
}

// Função para resetar a tabela e o localStorage
function resetar() {
    let tabela = document.getElementById('tabela-atributos');
    
    // Remove a classe highlight de todas as colunas
    let colunas = tabela.querySelectorAll('td');
    colunas.forEach(coluna => {
        coluna.classList.remove('highlight');
    });

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            tabela.rows[i].cells[j].textContent = '-';
        }
    }

    localStorage.removeItem('atributosD&D');
    localStorage.removeItem('maiorColuna'); // Remove a informação da maior coluna
    rolagens = 0; // Reseta o contador de rolagens

    // Habilita o botão de gerar atributos após resetar
    document.getElementById('gerar-atributos').disabled = false;
}

// Event listener para o botão de gerar atributos
document.getElementById('gerar-atributos').addEventListener('click', gerarAtributos);

// Event listener para o botão de resetar
document.getElementById('resetar').addEventListener('click', resetar);

// Carregar dados do localStorage ao iniciar
window.onload = carregarDoLocalStorage;
