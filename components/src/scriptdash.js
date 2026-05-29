// ======================================
// DADOS FALSOS (MOCK) - Substitua pelo Firebase
// ======================================
const dadosMock = {
    total: 1250,
    cidades: {
        "São Paulo": 450,
        "Campinas": 300,
        "Guarulhos": 250,
        "Osasco": 150,
        "Santos": 100
    },
    ultimos: [
        { nome: "João Silva", cidade: "São Paulo", data: "29/05/2026" },
        { nome: "Maria Souza", cidade: "Campinas", data: "28/05/2026" },
        { nome: "Pedro Santos", cidade: "Guarulhos", data: "27/05/2026" }
    ]
};

// ======================================
// RENDERIZAÇÃO DO DASHBOARD
// ======================================
function renderDashboard(dados) {
    // 1. Atualizar Topo
    document.getElementById('total-apoiadores').innerText = dados.total;
    
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
    new Chart(
        document.getElementById('graficoCidade'),
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

// Inicializa assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard(dadosMock);
});

