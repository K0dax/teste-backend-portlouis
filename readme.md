# Verificação de pedidos pendentes

Este código lê arquivos de pedidos e notas, processa-os e gera uma lista de itens organizados com as informações de cada pedido e de cada notas. Depois, ele executa algumas funções de verificação de critérios para garantir que as informações dos pedidos e notas estejam corretas.

## Dependências

Este código utiliza a biblioteca `fs` do Node.js para ler arquivos do sistema de arquivos, e a biblioteca `path` para trabalhar com caminhos de arquivos. 

## Funcionamento

O código começa lendo todos os arquivos de pedidos do diretório "./Pedidos/", filtrando apenas os arquivos com extensão ".txt". 

Em seguida, ele processa cada arquivo de pedido, adicionando um "id_pedido" em cada linha do arquivo e criando um objeto para cada linha, que é adicionado a um array de objetos. 

Esses arrays de objetos são combinados em um único array que contém todos os pedidos processados, ordenados pelo id do pedido e pelo número do item. 

Depois, a função `verificarListaPedidos` é chamada, passando a lista de pedidos como parâmetro. Essa função executa uma série de funções de verificação para garantir que as informações dos pedidos sejam válidas. Se alguma das funções de verificação encontrar um problema, uma exceção é lançada e o programa para.

As funções de verificação incluem a verificação do `número do item`(deve ser um inteiro maior que zero, não pode haver números de item duplicados e devem seguir uma ordem crescente), a verificação do `código do produto` (deve seguir um padrão alfanumérico), a verificação da `quantidade do produto` (deve ser um número inteiro maior que zero) e a verificação do `valor unitário do produto`(deve ser um número maior que zero).

Em seguida, ele executa a leitura de todos os arquivos de notas do diretório "./Notas/", filtrando apenas os arquivos com extensão ".txt".

Depois, ele processa cada arquivo de nota, adicionando um "id_nota" em cada linha do arquivo e criando um objeto para cada linha, que é adicionado a um array de objetos. 

Esses arrays de objetos são combinados em um único array que contém todas as notas processadas e ordenadas pelo id do pedido e pelo número do item.

Após isso, roda a função `verificarListaNotas` que recebe a lista de notas como parâmentro. Essa função executa uma série de funções de verificação para garantir que as informações das notas sejam válidas. Se alguma das funções de verificação encontrar um problema, uma exceção é lançada e o programa para.

As funções de verificação incluem a verificação do `id do pedido`(deve seguir um padrão alfanumérico), do `número do item` (deve ser um inteiro maior que zero) e a verificação da `quantidade do produto` (deve ser um número inteiro maior que zero).

Logo após a validação dos itens, os itens que se repetem em notas diferentes são somados, para que não aja repetição de itens na lista. Essa nova lista sem repetições e com as quantidades somadas passa a ser a constante `notasSomadas`.

As `notasSomadas` e a `listaPedidos` são parâmetros da função `checarItens` para verificar se todos os itens das notas existem na `listaPedidos`, caso algum item não exista dispara uma exceção e o programa para.

Depois a lista `listaPendentes` é criada reduzindo a quantidade de produtos da `listaPedidos` de acordo com a `notasSomadas`.

Os pedidos são agrupados na função `agrupandoPedido` que recebe a `listaPendentes` como parâmetro e cria objetos dentro de `pedidoAgrupado` que tem `id_pedido` como chave do objeto.

O objeto possui `itens`um array que armazena `número_item` e `quantidade_produto`, `total_pedido` que armazena o valor total da soma do total de todos os itens do pedido e `saldo_valor` que armazena a quantidade de itens pendentes do pedido.

E por fim a função de impressão é chamada e imprime os pedidos pendentes, um a um e em ordem no arquivo `pendentes.txt`.

## Execução

Para executar o código, basta rodar o arquivo pendentes.js no terminal. O diretório atual deve conter os diretórios Pedidos e Notas, que contém os arquivos de pedidos e notas a serem processados pelo código. O resultado da execução será uma lista de objetos com as informações dos pedidos organizadas, ou uma exceção caso alguma das funções de verificação encontre um problema.