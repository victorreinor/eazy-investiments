const xlsx = require('xlsx');

class Excel {
  arrayToSheet(data) {
    console.log('data', data)
    const workbook = xlsx.utils.book_new();
    const worksheetData = data.map(item => ({
      Papel: item.Papel,
      Segmento: item.Segmento,
      'Cotação': item['Cotação'],
      'FFO Yield': item['FFO Yield'],
      'Dividend Yield': item['Dividend Yield'],
      'P/VP': item['P/VP'],
      'Valor de Mercado': item['Valor de Mercado'],
      Liquidez: item.Liquidez,
      'Qtd de imóveis': item['Qtd de imóveis'],
      'Preço do m2': item['Preço do m2'],
      'Aluguel por m2': item['Aluguel por m2'],
      'Cap Rate': item['Cap Rate'],
      'Vacância Média': item['Vacância Média'],
      'Tipo de Dividendo': item?.Dividendos?.Tipo,
      'Data COM': item && item.Dividendos ? item.Dividendos['Data COM'] : '',
      'Data de Pagamento': item?.Dividendos?.Pagamento,
      'Valor do Dividendo': item?.Dividendos?.Valor
      // 'Endereço': item['Endereço'],
      // Link: item.Link,
    }));

    const worksheet = xlsx.utils.json_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Dados');
    xlsx.writeFile(workbook, 'fii.xlsx');
  }
}

module.exports = Excel;