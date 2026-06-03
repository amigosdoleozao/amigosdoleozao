import { initUI } from './ui.js';
import { cadastrarApoiador, ouvirApoiadores, ouvirReunioes } from './firebase/db.js';
import { initScriptDash } from '../components/src/scriptdash.js';
import { initLogin } from './login.js';
import { initReunioes } from './reunioes.js';

// Inicializa componentes visuais
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initScriptDash();
    initLogin();
    initReunioes();

    // Referência ao formulário de cadastro na página principal
    const addForm = document.querySelector('.add');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = addForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            const dados = {
                nome: addForm.nome.value,
                email: addForm.email.value,
                telefone: addForm.telefone.value,
                cidade: addForm.cidade.value,
                bairro: addForm.bairro.value,
                mensagem: addForm.mensagem.value,
            };

            try {
                await cadastrarApoiador(dados);
                addForm.reset();
                alert('Cadastro enviado com sucesso!');
            } catch (err) {
                alert('Ocorreu um erro ao enviar o cadastro. Tente novamente.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // Opcional: Atualizar o contador da página (se existir elemento "contador")
    const contador = document.getElementById('contador');
    if (contador) {
        ouvirApoiadores((apoiadores) => {
            contador.innerText = apoiadores.length;
        });
    }

    // Renderizar reuniões públicas no index.html
    const carrosselReunioes = document.getElementById('carrossel-reunioes-wrapper');
    if (carrosselReunioes) {
        ouvirReunioes((reunioes) => {
            carrosselReunioes.innerHTML = '';
            const reunioesPublicas = reunioes.filter(r => r.publica);

            if (reunioesPublicas.length === 0) {
                carrosselReunioes.innerHTML = '<p style="text-align: center; width: 100%;">Nenhuma reunião pública agendada no momento.</p>';
                return;
            }

            reunioesPublicas.forEach(reuniao => {
                let dataFormatada = reuniao.data;
                if (reuniao.data) {
                    const dataObj = new Date(reuniao.data);
                    if (!isNaN(dataObj.getTime())) {
                        dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    }
                }

                // Imagem aleatória para o card
                const randomImg = Math.floor(Math.random() * 5) + 1;
                
                const slide = document.createElement('div');
                slide.className = 'swiper-slide slide-card';
                slide.style.background = `url('https://picsum.photos/400/300?random=${reuniao.id}') center/cover`;
                slide.style.position = 'relative';

                slide.innerHTML = `
                    <div class="slide-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); border-radius: 20px;"></div>
                    <div style="position: relative; z-index: 2; text-align: left;">
                        <span style="background: #00ff99; color: black; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; margin-bottom: 10px; display: inline-block;">
                            ${reuniao.modalidade || 'Presencial'}
                        </span>
                        <h3 style="margin-bottom: 10px; font-size: 22px;">${reuniao.descricao}</h3>
                        <p style="margin-bottom: 5px; font-size: 14px;"><i class="fa-regular fa-calendar"></i> ${dataFormatada}</p>
                        <p style="margin-bottom: 5px; font-size: 14px;"><i class="fa-solid fa-location-dot"></i> ${reuniao.local}</p>
                        <p style="font-size: 14px;"><i class="fa-solid fa-user"></i> ${reuniao.responsavel}</p>
                    </div>
                `;

                carrosselReunioes.appendChild(slide);
            });
        });
    }
});
