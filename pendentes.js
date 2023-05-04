const fs = require("fs");
const path = require("path");

const pedidosPath = "./Pedidos/";
const notasPath = "./Notas/";

// Ler arquivos de pedidos
const filesPedido = fs
  .readdirSync(pedidosPath)
  .filter((file) => path.extname(file) === ".txt");

// Processar cada arquivo de pedido
const pedidos = filesPedido.map((file) => {
  const filePath = path.join(pedidosPath, file);
  let fileData = fs.readFileSync(filePath, { encoding: "utf8" });
  const id = file.replace(/\.txt$/, "");
  fileData = fileData.replace(/\}/g, `, "id_pedido": "${id}"}`); // Adicionando o id_pedido no fim de todas as linhas
  const rows = fileData.trim().split(/[\r\n]+/);

  // Converter as linhas em objetos
  const items = rows.map((row) => JSON.parse(row.trim()));
  return items;
});

// Converter pedidos em lista de itens organizada
const listaPedidos = pedidos
  .flatMap((pedido) => {
    return pedido.map((item) => ({
      id_pedido: item.id_pedido,
      número_item: item.número_item,
      código_produto: item.código_produto,
      quantidade_produto: item.quantidade_produto,
      valor_unitário_produto: parseFloat(
        item.valor_unitário_produto.replace(",", ".")
      ).toFixed(2), // Substituindo , por . para não ter problemas nos cálculos
    }));
  })
  .sort((a, b) => {
    // Ordenar por id_pedido e por número_item
    if (a.id_pedido !== b.id_pedido) {
      return a.id_pedido - b.id_pedido;
    }
    return a.número_item - b.número_item;
  });

// Função responsável por rodar a listaPedidos e executar as outras funções de verificação de critérios
function verificarListaPedidos(listaPedidos) {
  let ultimoNumero = 0;
  let itemNumSet = new Set(); // Salvar pares de pedido-número para a verificação
  let ultimoId = "";

  for (const pedido of listaPedidos) {
    const {
      número_item,
      código_produto,
      quantidade_produto,
      valor_unitário_produto,
      id_pedido
    } = pedido;

    if (id_pedido !== ultimoId) {
      // Condicional para verificar se mudou o número do pedido de um pedido pro outro
      ultimoId = id_pedido;
      ultimoNumero = 0;
      itemNumSet.clear(); // Limpando os registros de pares pedido-número
    }

     // Desestruturando pedido para facilitar acesso aos dados

    verificarNumeroItem(número_item, itemNumSet, id_pedido, ultimoNumero);
    verificarCodigoProduto(código_produto);
    verificarQuantidadeProduto(quantidade_produto, número_item, id_pedido);
    verificarValorUnitario(valor_unitário_produto, número_item, id_pedido);

    ultimoNumero = número_item;
  }
}

function verificarNumeroItem(número_item, itemNumSet, id_pedido, ultimoNumero) {
  if (!Number.isInteger(número_item) || número_item <= 0) {
    // Verificando se é inteiro e maior que 0
    throw new Error(`O pedido ${id_pedido} tem um número_item inválido.`);
  }

  const itemNumKey = `${id_pedido}-${número_item}`; // Criando par pedido-número
  if (itemNumSet.has(itemNumKey)) {
    // Verificando se par pedido-numero ja foi usado
    throw new Error(
      `O item de número ${número_item} do pedido ${id_pedido} está duplicado.`
    );
  }

  itemNumSet.add(itemNumKey); // Salvando par pedido-numero

  if (número_item !== ultimoNumero + 1) {
    // Verificando se o número_item segue a ordem crescente 1,2,3,...
    throw new Error(
      `O item ${ultimoNumero + 1} está faltando no pedido ${id_pedido}.`
    );
  }
}

function verificarCodigoProduto(código_produto) {
  if (!/^[a-zA-Z0-9]+$/.test(código_produto)) {
    // Verificando se o código_produto segue o padrão alfanumérico
    throw new Error("O item código do produto é inválido");
  }
}

function verificarQuantidadeProduto(
  quantidade_produto,
  número_item,
  id_pedido
) {
  if (!Number.isInteger(quantidade_produto) || quantidade_produto <= 0) {
    // Verifica se a quantidade_produto é um número inteiro e se é maior que 0
    throw new Error(
      `O item ${número_item} do pedido ${id_pedido} possui a quantidade inválida`
    );
  }
}

function verificarValorUnitario(
  valor_unitário_produto,
  número_item,
  id_pedido
) {
  if (isNaN(valor_unitário_produto) || valor_unitário_produto <= 0) {
    // Verificando se valor_unitário_produto é um número e se é maior que 0
    throw new Error(
      `O item ${número_item} do pedido ${id_pedido} possui a valor unitário inválido`
    );
  }
}
verificarListaPedidos(listaPedidos);

// Ler arquivos de notas
const filesNota = fs
  .readdirSync(notasPath)
  .filter((file) => path.extname(file) === ".txt");

// Processar cada arquivo de notas
const notas = filesNota.map((file) => {
  const filePath = path.join(notasPath, file);
  let fileData = fs.readFileSync(filePath, { encoding: "utf-8" });
  const id = file.replace(/\.txt$/, "");
  fileData = fileData.replace(/\}/g, `, "id_nota": "${id}"}`); // Adicionando o id_nota no fim de todas as linhas
  const rows = fileData.trim().split(/[\r\n]+/);

  // Converter as linhas em objetos
  const items = rows.map((row) => JSON.parse(row.trim()));
  return items;
});

// Ordenando Notas
const notasOrdem = notas
  .flatMap((nota) => nota)
  .sort((a, b) => {
    // Ordenar por id_pedido e por número_item
    if (a.id_pedido !== b.id_pedido) {
      return a.id_pedido - b.id_pedido;
    }
    return a.número_item - b.número_item;
  });

function verificarListaNotas(listaNotas) {
  for (const notaItem of listaNotas) {
    const { id_pedido, número_item, id_nota, quantidade_produto } = notaItem; // Desestruturando nota para facilitar acesso aos dados

    IdPedido(id_pedido, número_item, id_nota);
    NumeroItem(número_item, id_nota);
    VerificarQuantidadeProduto(
      quantidade_produto,
      id_nota,
      id_pedido,
      número_item
    );
  }
}
function IdPedido(id_pedido, número_item, id_nota) {
  if (!/^[a-zA-Z0-9]+$/.test(id_pedido)) {
    // Verificando se o id_pedido segue o padrão alfanumérico
    throw new Error(
      `O item ${número_item} do pedido ${id_pedido} na nota ${id_nota} tem um id_pedido inválido.`
    );
  }
}

function NumeroItem(número_item, id_nota) {
  if (!Number.isInteger(número_item) || número_item <= 0) {
    // Verifica se o número_item é positivo e inteiro
    throw new Error(`A nota ${id_nota} tem um número_item inválido.`);
  }
}

function VerificarQuantidadeProduto(
  quantidade_produto,
  id_nota,
  id_pedido,
  número_item
) {
  if (!Number.isInteger(quantidade_produto) || quantidade_produto <= 0) {
    // Verifica se a quantidade_item é positivo e inteiro
    throw new Error(
      `O item ${número_item} do pedido ${id_pedido} na nota ${id_nota} tem um quantidade_produto inválida.`
    );
  }
}

verificarListaNotas(notasOrdem);

// Somando itens das notas
const listaNotas = notasOrdem.reduce((acc, item) => {
  // Unindo itens iguais e acrescentando a quantidade
  const key = item.id_pedido + "_" + item.número_item;
  if (acc[key]) {
    // Verificando o par pedido-número existir como chave no acc
    acc[key].quantidade_produto += item.quantidade_produto;
  } else {
    acc[key] = { ...item }; // Adiciona o Item no acc
  }
  return acc;
}, {});

const notasSomadas = Object.values(listaNotas); // Retorna um array contendo todos os valores dos pares chave-valor
// Procurando itens da lista de notas que não exitem na lista de pedidos
function checarItens(notasSomadas, listaPedidos) {
  const itemPerdidos = notasSomadas.filter((item) => {
    if (typeof item.id_pedido !== "string") {
      // Verifica se o id_pedido do item é uma string
      item.id_pedido = JSON.stringify(item.id_pedido); // Converte o id_pedido em string
    }

    return !listaPedidos.some((a) => {
      return (
        a.id_pedido === item.id_pedido && a.número_item === item.número_item
      ); // Percorre a listaPedidos e retorna true se não encontrar o item lá e o adiciona ao array itemPerdidos
    });
  });
  if (itemPerdidos.length) {
    // Se houver itens dentro do array itemPerdidos dispara o Erro
    throw new Error(
      "Um ou mais itens da lista de notas não existem na lista de pedidos"
    );
  }
}
checarItens(notasSomadas, listaPedidos);

const listaPendentes = listaPedidos
  .map((itemPedido) => {
    const itemAgrupado = notasSomadas.find(
      (itemSomado) =>
        itemSomado.id_pedido === itemPedido.id_pedido &&
        itemSomado.número_item === itemPedido.número_item
    ); // Busca o itemPedido no array notasSomadas

    if (!itemAgrupado) {
      // Condicional caso o item não esteja nas notas
      return itemPedido; // Mantém o itemPedido com a mesma quantidade
    }

    if (itemPedido.quantidade_produto > itemAgrupado.quantidade_produto) {
      // Caso o itemPedido tenha uma quantidade maior que itemAgrupado
      const itemPendente = { ...itemPedido }; // Criando itemPendente que possui os mesmos valores e propriedades do itemPedido
      itemPendente.quantidade_produto -= itemAgrupado.quantidade_produto; // Atribuindo subtração de quantidade_produto
      return itemPendente;
    }

    if (itemPedido.quantidade_produto < itemAgrupado.quantidade_produto) {
      // Caso a quantidade de itemPedido não seja suficiente para suprir a quantidade de itemAgrupado
      throw new Error(
        `O item ${itemPedido.número_item} do pedido ${itemPedido.id_pedido} não tem quantidade suficiente para suprir as notas`
      );
    }

    return null; // Retornando itens com quantidade 0
  })
  .filter((item) => item !== null); // Removendo itens de quantidade 0

const pedidoAgrupado = {}; // Criando objeto para armazenar os pedidos com os dados de impressão

function agrupandoPedido(listaPendentes) { 
  for (const pendente of listaPendentes) { // Loop pra percorrer item por item da listaPendentes
    const { id_pedido, número_item, quantidade_produto, valor_unitário_produto } = pendente; // Desestruturando pra manipular os dados com mais facilidade

    if (!pedidoAgrupado[id_pedido]) { // Verifica se já existe uma chave com id_pedido do item atual
      pedidoAgrupado[id_pedido] = { // Cria Objeto dentro de pedidoAgrupado com id_pedido como chave
        itens: [], // Array para armazenar os itens do pedido correspondente dentro
        total_pedido: 0, // Armazenar o valor total dos itens pendentes do pedido
        saldo_valor: 0, // Armazenar quantidade de itens pendentes do pedido
      };
    }
    const saldo_quantidade = quantidade_produto; // Armazenando quantidade_produto do item
    const calcItemTotal = parseFloat(valor_unitário_produto).toFixed(2) // Convertendo para numero de ponto flutuante com 2 casas decimais
    pedidoAgrupado[id_pedido].itens.push({ número_item, saldo_quantidade }); // Adicionando o item ao array de itens, o representando com número_item e saldo_quantidade
    pedidoAgrupado[id_pedido].saldo_valor += saldo_quantidade // Atribuindo soma do saldo_valor
    pedidoAgrupado[id_pedido].total_pedido += quantidade_produto * calcItemTotal // Calculado total do valor dos itens pendentes do pedido
  }
}
agrupandoPedido(listaPendentes)

function imprimirPendentes(pedidoAgrupado){
  for (const id_pedido in pedidoAgrupado){ // Percorrendo pedido dentro do array de pedidos
    const pedido = pedidoAgrupado[id_pedido] // Buscando objeto correspondente a id_pedido e armazenando em pedido
    const {total_pedido,saldo_valor,itens} = pedido // Desestruturação do objeto pedido
    let output = `O pedido ${id_pedido} tem um valor total de R$${total_pedido} e tem ${saldo_valor} itens.\nSendo eles:\n\n` // Informações gerais do pedido

      for(let i = 0; i < itens.length; i++ ){ // Item por item do array
        output += `- Número do item: ${itens[i].número_item}, Saldo de quantidade: ${itens[i].saldo_quantidade}\n`;

        if (i === itens.length - 1) { // Pular uma linha na última linha do pedido
          output += '\n';
        }
      }
    fs.appendFileSync('./teste.txt', output); // Onde será escrito e o que será escrito 
  }
}
imprimirPendentes(pedidoAgrupado);
