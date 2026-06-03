import { cadastrarReuniao, ouvirReunioes, deletarReuniao } from './firebase/db.js';
import { verificarAcessoAdmin } from './login.js';

export function initReunioes() {
    const formContainer = document.getElementById('reunioes-form-container');
    const formReuniao = document.getElementById('form-reuniao');
    const btnNova = document.getElementById('btn-nova-reuniao');
    const btnCancelar = document.getElementById('btn-cancelar-reuniao');
    const tabelaReunioes = document.getElementById('tabela-reunioes');

    if (!formContainer || !formReuniao || !tabelaReunioes) return;

    // Apenas admin pode ver a página
    verificarAcessoAdmin((user, role) => {
        // Inicializa listeners do form
        btnNova.addEventListener('click', () => {
            formContainer.style.display = 'block';
        });

        btnCancelar.addEventListener('click', () => {
            formContainer.style.display = 'none';
            formReuniao.reset();
        });

        formReuniao.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = formReuniao.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Salvando...';
            submitBtn.disabled = true;

            const dados = {
                data: formReuniao.data.value, // ISO string 'YYYY-MM-DDTHH:mm'
                descricao: formReuniao.descricao.value,
                local: formReuniao.local.value,
                modalidade: formReuniao.modalidade.value,
                pauta: formReuniao.pauta.value,
                responsavel: formReuniao.responsavel.value,
                status: formReuniao.status.value,
                publica: formReuniao.publica.checked
            };

            try {
                await cadastrarReuniao(dados);
                formReuniao.reset();
                formContainer.style.display = 'none';
                alert('Reunião cadastrada com sucesso!');
            } catch (err) {
                console.error(err);
                alert('Erro ao cadastrar a reunião.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });

        // Carregar reuniões na tabela
        ouvirReunioes((reunioes) => {
            tabelaReunioes.innerHTML = '';
            
            reunioes.forEach(reuniao => {
                const tr = document.createElement('tr');
                
                // Formatar Data
                let dataFormatada = reuniao.data;
                if (reuniao.data) {
                    const dataObj = new Date(reuniao.data);
                    if (!isNaN(dataObj.getTime())) {
                        dataFormatada = dataObj.toLocaleString('pt-BR');
                    }
                }

                tr.innerHTML = `
                    <td style="padding: 10px;">${dataFormatada}</td>
                    <td style="padding: 10px;">${reuniao.descricao || ''}</td>
                    <td style="padding: 10px;">${reuniao.local || ''} <br><small style="color:#aaa;">${reuniao.modalidade || ''}</small></td>
                    <td style="padding: 10px;">
                        <span style="padding: 5px 10px; border-radius: 5px; font-size: 12px; background: ${reuniao.status === 'Agendada' ? '#00ccff' : (reuniao.status === 'Realizada' ? '#00ff99' : '#ff4d4d')}; color: black;">
                            ${reuniao.status || ''}
                        </span>
                    </td>
                    <td style="padding: 10px;">${reuniao.publica ? 'Sim' : 'Não'}</td>
                    <td style="padding: 10px;">
                        <button class="btn-excluir" data-id="${reuniao.id}" style="background: transparent; border: none; color: #ff4d4d; cursor: pointer;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;

                tabelaReunioes.appendChild(tr);
            });

            // Botoes excluir
            const btnsExcluir = document.querySelectorAll('.btn-excluir');
            btnsExcluir.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja excluir esta reunião?')) {
                        try {
                            await deletarReuniao(id);
                        } catch (err) {
                            alert('Erro ao excluir.');
                        }
                    }
                });
            });
        });
    });
}
