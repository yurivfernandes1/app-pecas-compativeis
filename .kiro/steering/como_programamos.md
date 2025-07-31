Nos preocupamos em programar da forma mais eficiente possível, sempre pensando em performance, organização de código e da estruturação de arquivos, reutilização e componentização de código e no fluxo de trabalho.
Temos estruturas fixas de trabalho e seguimos padrões para aumentar a manutenibilidade do código.
Temos a premissa de só entregar tarefas com funcionalidades testadas e validadas, no ponto de vista de requisitos, funcionalidade e usabilidade.
Além disso, toda nova feature deve ser documentada de forma técnica para facilitar o entendimento e aumenta a manutenibilidade das aplicações como um todo.
Em todos os nossos sistemas temos de o módulo de logs de execução de tarefas, testes e acesso à apis.
Sempre ter duas branchs, homolog e master.

Nos preocupamos em sempre criar nossas telas de forma compenentizada para aumentar a reutilização de código. 
Telas, botões, tabelas, formulários, dropdowns, modais etc., tudo deve ser componetizado para poder ser reutilizado.
Ter um alto índice de manutenibilidade e reutilização de código é nossa meta.
Separaremos arquivos de páginas, componentes, estilos, serviços e configurações em suas respectivas pastas.
Outra premissa é que nosso designer deve ser sempre responsivo, possibilitando a visualização em diversos dispositivos, sendo mobile ou pc.
Além disso antes de entregar qualquer feature, iremos sempre efetuar testes nas funcionalidades, em todos os âmbitos, principalmente em usabilidade e funcionalidade.

É necessário sempre configurar credenciais de acesso em arquivos de configurações. As credenciais do banco de dados e de sistemas integrados devem estar sempre no .env.
Não podemos commitar arquivos com nome de usuário e/ou senha de usuários. Arquivos de logs e comandos python não podem conter dados de usuários em nenhuma hipótese.