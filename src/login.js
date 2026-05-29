import { loginUsuario, observarEstadoAutenticacao } from './firebase/auth.js';
import { getUserRole } from './firebase/db.js';

export function initLogin() {
    const loginForm = document.getElementById('form-login-admin');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const btn = loginForm.querySelector('button[type="submit"]');
        
        const originalText = btn.innerText;
        btn.innerText = 'Entrando...';
        btn.disabled = true;

        try {
            const userCredential = await loginUsuario(email, password);
            const user = userCredential.user;
            
            // Verificar role no Firestore
            const role = await getUserRole(user.uid);
            
            if (role === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                alert('Acesso negado. Apenas administradores podem acessar o painel.');
                // opcional: deslogarUsuario();
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

export function verificarAcessoAdmin(callback) {
    observarEstadoAutenticacao(async (user) => {
        if (user) {
            const role = await getUserRole(user.uid);
            if (role === 'admin') {
                callback(user);
            } else {
                window.location.href = 'loginadmin.html';
            }
        } else {
            window.location.href = 'loginadmin.html';
        }
    });
}