# FocusPro — versão inicial

Aplicativo web estático em português brasileiro para organizar tarefas, hábitos e sessões Pomodoro.

## Arquivos
- `index.html`: estrutura das telas.
- `style.css`: visual responsivo.
- `app.js`: tarefas, hábitos, cronômetro e armazenamento local.
- `manifest.json` e `sw.js`: base para instalação como PWA.

## Como testar
1. Extraia o ZIP.
2. Abra `index.html` no navegador para uma demonstração básica.
3. Para testar a instalação PWA e o service worker, publique a pasta em um host HTTPS ou use um servidor local.

## Como publicar gratuitamente (GitHub Pages)
1. Crie uma conta GitHub com ajuda de um responsável, se necessário.
2. Crie um repositório público chamado `focuspro`.
3. Envie todos os arquivos desta pasta para a raiz do repositório.
4. Nas configurações do repositório, abra **Pages**.
5. Escolha a publicação a partir da branch principal (`main`) e da pasta raiz (`/root`), se essa opção aparecer.
6. Aguarde o endereço de publicação indicado pelo GitHub Pages e teste em um celular.
7. Faça testes de tarefas, cronômetro e armazenamento em diferentes navegadores.

A disponibilidade e as opções da interface do GitHub podem mudar. Não inclua senhas, tokens ou chaves secretas no repositório.

## Monetização: o que está e o que falta
Esta versão **não recebe dinheiro ainda**.
- O bloco “Espaço para anúncio” é apenas um espaço visual. Não há anúncios reais nem receita de anúncios.
- O botão Premium registra apenas interesse no navegador local. Não há checkout, assinatura nem cobrança.
- O preço de R$ 4,99/mês é uma proposta ilustrativa, não uma oferta de compra ativa.

Para monetizar de verdade:
1. Escolha um provedor de pagamentos que aceite seu país, produto e situação cadastral.
2. Configure checkout e assinaturas no ambiente oficial do provedor.
3. Implemente validação da assinatura no servidor; nunca confie apenas num botão ou em dados guardados no navegador.
4. Escolha uma rede de anúncios e solicite aprovação do site/app.
5. Adicione avisos de privacidade, política de privacidade e termos, conforme aplicável.
6. Teste primeiro em modo de teste/sandbox. Só ative cobranças depois de verificar cancelamento, reembolso e suporte.

**Não coloque chaves secretas em `app.js` ou em qualquer arquivo público.** Uma aplicação estática sozinha não consegue validar com segurança assinaturas pagas. Para isso, é necessário um backend seguro, que pode ter limites ou custos. Não prometa acesso Premium até que a validação real esteja implementada.

Como o proprietário é menor de idade, peça ajuda a um responsável para contas comerciais, pagamentos, anúncios, impostos e contratos quando o serviço exigir maioridade.

## Limitações conhecidas
- Os dados são guardados localmente no navegador; não sincronizam entre dispositivos.
- Limpar os dados do navegador pode apagar tarefas e hábitos.
- O temporizador deve permanecer aberto para funcionar de forma mais confiável.
- Ainda não há conta de usuário, sincronização em nuvem, IA, anúncios reais ou pagamentos.
