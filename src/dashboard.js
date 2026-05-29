import { verificarAcessoAdmin } from './login.js';
import { deslogarUsuario } from './firebase/auth.js';
import { ouvirApoiadores } from './firebase/db.js';

export function initDashboard() {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (!dashboardContainer) return;

    verificarAcessoAdmin((user) => {
        // Usuário é admin, carregar dados
        const adminEmailSpan = document.getElementById('admin-email');
        if (adminEmailSpan) adminEmailSpan.innerText = user.email;

        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await deslogarUsuario();
                window.location.href = 'loginadmin.html';
            });
        }

        // Listar apoiadores (exemplo)
        const listaApoiadores = document.getElementById('lista-apoiadores');
        const countApoiadores = document.getElementById('count-apoiadores');
        
        if (listaApoiadores && countApoiadores) {
            ouvirApoiadores((apoiadores) => {
                countApoiadores.innerText = apoiadores.length;
                listaApoiadores.innerHTML = '';
                apoiadores.forEach(ap => {
                    const li = document.createElement('li');
                    li.innerText = `${ap.nome} - ${ap.email} (${ap.cidade})`;
                    listaApoiadores.appendChild(li);
                });
            });
        }
    });
}