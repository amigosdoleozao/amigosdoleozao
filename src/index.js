import { initUI } from './ui.js';
import { cadastrarApoiador, ouvirApoiadores } from './firebase/db.js';
import { initScriptDash } from '../components/src/scriptdash.js';
import { initLogin } from './login.js';

// Inicializa componentes visuais
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initScriptDash();
    initLogin();

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
});
