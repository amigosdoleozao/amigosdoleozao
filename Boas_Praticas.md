# Boas Práticas e Arquitetura do Projeto

Este projeto foi refatorado para remover dependências legadas e migrar a lógica inteiramente para o **Firebase**. O código JavaScript foi reestruturado usando **ESModules** e o empacotador **Webpack**, visando maior manutenibilidade, escalabilidade e segurança.

## 1. Modularização e Separação de Responsabilidades

O código monolítico (`script.js`) foi dividido em módulos específicos. Cada arquivo agora possui uma responsabilidade única:

- `src/firebase/config.js`: Centraliza as credenciais e a inicialização do Firebase (`initializeApp`). Exporta apenas as referências necessárias (`db`, `auth`).
- `src/firebase/db.js`: Contém exclusivamente a lógica de leitura e escrita no Firestore (ex: `addDoc`, `onSnapshot`).
- `src/firebase/auth.js`: Agrupa métodos de autenticação de usuários (ex: `signInWithEmailAndPassword`).
- `src/ui.js`: Cuida de interações visuais que não dependem do banco de dados (ex: Inicialização do Swiper, menu mobile responsivo).
- `src/index.js`: O ponto de entrada (Entry Point). Ele importa os serviços de UI e de Banco de Dados para vincular os eventos dos elementos HTML (como o `submit` do formulário) à lógica de negócio.

**Por que isso é uma boa prática?**
- **Manutenibilidade:** Se você precisar mudar o serviço de banco de dados no futuro, você só modifica o módulo de banco de dados (`db.js`), sem afetar a lógica visual (`ui.js`).
- **Reuso de Código:** Os métodos em `db.js` e `auth.js` podem ser importados facilmente em outras páginas (ex: no Painel de Admin) sem precisar duplicar a inicialização do Firebase.

## 2. Empacotamento com Webpack

O uso do Firebase 9+ (versão Modular) exige um ambiente que suporte imports modernos (ES Modules). Navegadores têm suporte nativo limitado para resoluções de pacotes Node, então introduzimos o **Webpack**.

- **Configuração (`webpack.config.js`):** O Webpack lê a partir de `src/index.js`, empacota todas as dependências (como o Firebase e seus submódulos) e gera um arquivo final em `dist/bundle.js`.
- **HTML:** O `index.html` agora aponta para `<script src="dist/bundle.js"></script>`, garantindo que o navegador faça apenas uma requisição para o JavaScript principal, melhorando a velocidade de carregamento.

**Comando Útil:** Para compilar alterações futuras, execute no terminal:
`npm run build`

## 3. Segurança e Validação de Dados

- **Proteção da Chave de API:** A apiKey do Firebase está no front-end, o que é o comportamento esperado. No entanto, lembre-se de configurar as **Regras de Segurança do Firestore (Firestore Security Rules)** no console do Firebase para evitar que qualquer pessoa envie dados arbitrários. Por exemplo:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /apoiador/{document=**} {
        allow read: if request.auth != null; // Apenas admin pode ver
        allow create: if request.resource.data.nome is string; // Qualquer um pode cadastrar, desde que passe um nome válido
      }
    }
  }
  ```
- **Feedback Visual (UX):** No `index.js`, o formulário muda o texto do botão para "Enviando..." e o desabilita até a resposta do banco. Essa é uma excelente prática para evitar o envio duplo e informar o usuário sobre o progresso.

## 4. Remoção de Lógica Inconsistente

- O backend foi totalmente focado em arquitetura *Serverless* (Firebase). Links legados que terminavam em `.php` (ex: `admin/login.php`, `cadastro.php`) foram redirecionados para os respectivos arquivos estáticos ou tiveram sua ação interceptada por JavaScript nativo. O atributo `action` das tags `<form>` foi removido para evitar recarregamento da página (comportamento padrão prevenido pelo `e.preventDefault()`).
