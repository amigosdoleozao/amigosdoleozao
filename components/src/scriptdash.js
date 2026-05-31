import { ouvirApoiadores } from '../../src/firebase/db.js';

// ======================================
// RENDERIZAÇÃO DO DASHBOARD
// ======================================
let chartInstance = null;

function renderDashboard(dados) {
    // 1. Atualizar Topo
    const elTotal = document.getElementById('total-apoiadores');
    if (!elTotal) return;
    
    elTotal.innerText = dados.total;
    
    const nomesCidades = Object.keys(dados.cidades);
    const valoresCidades = Object.values(dados.cidades);
    
    document.getElementById('total-cidades').innerText = nomesCidades.length;
    document.getElementById('total-ultimos').innerText = dados.ultimos.length;

    // 2. Preencher Tabela
    const tabelaUltimos = document.getElementById('tabela-ultimos');
    tabelaUltimos.innerHTML = '';
    
    dados.ultimos.forEach(item => {
        const tr = document.createElement('tr');
        
        const tdNome = document.createElement('td');
        tdNome.innerText = item.nome;
        
        const tdCidade = document.createElement('td');
        tdCidade.innerText = item.cidade;
        
        const tdData = document.createElement('td');
        tdData.innerText = item.data;
        
        tr.appendChild(tdNome);
        tr.appendChild(tdCidade);
        tr.appendChild(tdData);
        
        tabelaUltimos.appendChild(tr);
    });

    // 3. Renderizar Gráfico
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const ctx = document.getElementById('graficoCidade');
    if (ctx) {
        chartInstance = new Chart(
            ctx,
            {
                type: 'bar',
                data: {
                    labels: nomesCidades,
                    datasets: [{
                        label: 'Apoiadores',
                        data: valoresCidades,
                        borderWidth: 2,
                        backgroundColor: 'rgba(0, 255, 153, 0.5)',
                        borderColor: '#00ff99'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            }
        );
    }
}

// Inicializa assim que a página carregar
export function initScriptDash() {
    const elTotal = document.getElementById('total-apoiadores');
    if (!elTotal) return; // Evita erros em outras páginas

    ouvirApoiadores((apoiadores) => {
        const total = apoiadores.length;
        const cidades = {};
        const ultimos = [];

        apoiadores.forEach((ap, index) => {
            const cidade = ap.cidade || "Desconhecida";
            cidades[cidade] = (cidades[cidade] || 0) + 1;
            
            // Pega os 5 últimos
            if (index < 5) {
                let dataFormatada = "";
                if (ap.createdAt && ap.createdAt.toDate) {
                    dataFormatada = ap.createdAt.toDate().toLocaleDateString('pt-BR');
                } else {
                    dataFormatada = "N/A";
                }
                
                ultimos.push({
                    nome: ap.nome || "Sem nome",
                    cidade: cidade,
                    data: dataFormatada
                });
            }
        });

        renderDashboard({ total, cidades, ultimos });
    });
}

// Para manter compatibilidade caso fosse carregado isolado
document.addEventListener('DOMContentLoaded', () => {
    initScriptDash();
});
