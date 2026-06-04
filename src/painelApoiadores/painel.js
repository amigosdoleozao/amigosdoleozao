import { 
    buscarUltimosApoiadores, 
    buscarApoiadoresPorData, 
    buscarApoiadoresPorBairro, 
    buscarApoiadoresPorCidade, 
    buscarApoiadoresPorIndicador 
} from '../firebase/db.js';

export function initPainelApoiadores() {
    const containerResultados = document.getElementById('container-resultados');
    if (!containerResultados) return; // Não estamos na página painel.html

    const tituloResultado = document.getElementById('titulo-resultado');
    const tabelaResultados = document.getElementById('tabela-resultados');

    function renderTabela(apoiadores) {
        tabelaResultados.innerHTML = '';
        if (apoiadores.length === 0) {
            tabelaResultados.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #ccc;">Nenhum registro encontrado.</td></tr>';
            return;
        }

        apoiadores.forEach(ap => {
            let dataStr = 'Sem data';
            if (ap.createdAt) {
                // Lidando com serverTimestamp do Firebase
                const date = ap.createdAt.toDate ? ap.createdAt.toDate() : new Date(ap.createdAt);
                dataStr = date.toLocaleDateString('pt-BR');
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px;">${ap.nome || 'N/A'}</td>
                <td style="padding: 10px;">${ap.bairro || 'N/A'}</td>
                <td style="padding: 10px;">${ap.indicador || 'N/A'}</td>
                <td style="padding: 10px;">${dataStr}</td>
            `;
            tabelaResultados.appendChild(tr);
        });
    }

    async function executarConsulta(titulo, promiseConsulta) {
        containerResultados.style.display = 'block';
        tituloResultado.innerHTML = `Resultados: <span style="color: white; font-size: 18px;">${titulo}</span>`;
        tabelaResultados.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #00ff99;">Carregando...</td></tr>';
        containerResultados.scrollIntoView({ behavior: 'smooth', block: 'end' });

        try {
            const resultados = await promiseConsulta();
            renderTabela(resultados);
        } catch (err) {
            console.error("Erro na consulta: ", err);
            tabelaResultados.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #ff4d4d;">Erro ao buscar dados. Verifique os índices do Firebase no console.</td></tr>';
        }
    }

    // 1. Últimos 10
    const btnUltimos10 = document.getElementById('btn-ultimos-10');
    if (btnUltimos10) {
        btnUltimos10.addEventListener('click', () => {
            executarConsulta('Últimos 10 Cadastros', () => buscarUltimosApoiadores(10));
        });
    }

    // 2. Cadastros de Hoje
    const btnHoje = document.getElementById('btn-hoje');
    if (btnHoje) {
        btnHoje.addEventListener('click', () => {
            const inicio = new Date();
            inicio.setHours(0, 0, 0, 0);
            const fim = new Date();
            fim.setHours(23, 59, 59, 999);
            executarConsulta('Cadastros de Hoje', () => buscarApoiadoresPorData(inicio, fim));
        });
    }

    // 3. Últimos 7 Dias
    const btnSemana = document.getElementById('btn-semana');
    if (btnSemana) {
        btnSemana.addEventListener('click', () => {
            const fim = new Date();
            const inicio = new Date();
            inicio.setDate(inicio.getDate() - 7);
            inicio.setHours(0, 0, 0, 0);
            executarConsulta('Últimos 7 Dias', () => buscarApoiadoresPorData(inicio, fim));
        });
    }

    // 6. Busca por Data Customizada
    const btnBuscaData = document.getElementById('btn-busca-data');
    if (btnBuscaData) {
        btnBuscaData.addEventListener('click', () => {
            const dataInicioInput = document.getElementById('data-inicio').value;
            const dataFimInput = document.getElementById('data-fim').value;
            
            if (!dataInicioInput || !dataFimInput) {
                alert("Por favor, preencha ambas as datas.");
                return;
            }

            const inicio = new Date(dataInicioInput + 'T00:00:00');
            const fim = new Date(dataFimInput + 'T23:59:59');
            executarConsulta('Período Específico', () => buscarApoiadoresPorData(inicio, fim));
        });
    }

    // 7. Filtro por Bairro
    const btnBuscaBairro = document.getElementById('btn-busca-bairro');
    if (btnBuscaBairro) {
        btnBuscaBairro.addEventListener('click', () => {
            const bairro = document.getElementById('filtro-bairro').value;
            if (!bairro) {
                alert("Selecione um bairro.");
                return;
            }
            executarConsulta(`Filtro por Bairro (${bairro})`, () => buscarApoiadoresPorBairro(bairro));
        });
    }

    // 8. Filtro por Cidade
    const btnBuscaCidade = document.getElementById('btn-busca-cidade');
    if (btnBuscaCidade) {
        btnBuscaCidade.addEventListener('click', () => {
            const cidade = document.getElementById('filtro-cidade').value;
            if (!cidade) {
                alert("Selecione uma cidade.");
                return;
            }
            executarConsulta(`Filtro por Cidade (${cidade})`, () => buscarApoiadoresPorCidade(cidade));
        });
    }

    // 9. Busca por Indicador
    const btnBuscaIndicador = document.getElementById('btn-busca-indicador');
    if (btnBuscaIndicador) {
        btnBuscaIndicador.addEventListener('click', () => {
            const indicador = document.getElementById('filtro-indicador').value;
            if (!indicador) {
                alert("Digite o nome de um indicador.");
                return;
            }
            executarConsulta(`Filtro por Indicador (${indicador})`, () => buscarApoiadoresPorIndicador(indicador));
        });
    }

    // 10. Amostra Rápida (50)
    const btnAmostra = document.getElementById('btn-amostra');
    if (btnAmostra) {
        btnAmostra.addEventListener('click', () => {
            executarConsulta('Amostra de 50 Apoiadores', () => buscarUltimosApoiadores(50));
        });
    }
}