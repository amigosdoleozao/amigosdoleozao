import { loginUsuario, registrarUsuario, observarEstadoAutenticacao } from './firebase/auth.js';
import { getUserRole, setUserRole } from './firebase/db.js';

export function initLogin() {
    const loginForm = document.getElementById('form-login-admin');
    const registerForm = document.getElementById('form-register-admin');
    
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (!loginForm && !registerForm) return;

    // Alternar abas
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.style.background = '#00ff99';
            tabLogin.style.color = '#000';
            tabRegister.style.background = 'transparent';
            tabRegister.style.color = '#00ff99';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.style.background = '#00ff99';
            tabRegister.style.color = '#000';
            tabLogin.style.background = 'transparent';
            tabLogin.style.color = '#00ff99';
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
    }

    // Lógica de Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const btn = loginForm.querySelector('button[type="submit"]');
            
            const originalText = btn.innerText;
            btn.innerText = 'Entrando...';
            btn.disabled = true;

            try {
                await loginUsuario(email, password);
                // Qualquer usuário autenticado vai pro dashboard. A permissão fina é lá.
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error(error);
                alert('Erro ao fazer login. Verifique suas credenciais.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // Lógica de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const btn = registerForm.querySelector('button[type="submit"]');
            
            const originalText = btn.innerText;
            btn.innerText = 'Criando Conta...';
            btn.disabled = true;

            try {
                const userCredential = await registrarUsuario(email, password);
                const user = userCredential.user;
                
                // Gravar role "viewer" por padrão
                await setUserRole(user.uid, 'viewer', user.email);
                
                alert('Conta criada com sucesso! Você está logado como Visualizador.');
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error(error);
                alert('Erro ao criar conta. Talvez o e-mail já esteja em uso ou a senha seja muito fraca.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
}

export function verificarAcessoAdmin(callback) {
    observarEstadoAutenticacao(async (user) => {
        if (user) {
            const role = await getUserRole(user.uid) || 'viewer';
            callback(user, role);
        } else {
            // Se não logado, manda pro login, independente da página atual ser /components/
            window.location.href = 'loginadmin.html';
        }
    });
}