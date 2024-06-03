const xlsx = require('xlsx');
const { formatCurrency, formatPercentage } = require('../utils');

class Excel {
  arrayToSheet(values) {
    // const data = values
    const data = this._formatData(values)
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Dados');
    xlsx.writeFile(workbook, './result/fii.xlsx');
  }

  _formatData(data) {
    return data.map(item => {
      const row = {
        Papel: item.Papel,
        Segmento: item.Segmento,
        'Cotação': formatCurrency(item['Cotação']),
        'Dividend Yield': formatPercentage(item['Dividend Yield']),
        'P/VP': formatPercentage(item['P/VP']),
        'Valor de Mercado': formatCurrency(item['Valor de Mercado']),
        Liquidez: formatCurrency(item.Liquidez),
        'Vacância Média': formatPercentage(item['Vacância Média'])
      };

      if (item && item.Dividendos) {        
        row['Tipo de dividendo'] = item && item.Dividendos ? item.Dividendos['Tipo'] : 'Não possui';
        row['Data COM'] = item && item.Dividendos ? item?.Dividendos['Data COM'] : 'Não possui';
        row['Dividendo'] = item && item.Dividendos ? item.Dividendos['Valor'] : 'Não possui';
        row['Valor investido'] = item && item.Dividendos['Valor para investir'] ? item.Dividendos['Valor para investir'] : 'Não possui';
        row['Qtde de papel'] = item && item.Dividendos['Qtde de papel'] ? item.Dividendos['Qtde de papel'] : 'Não possui';
        row['Retorno de dividendos'] = item && item.Dividendos['Retorno de dividendos'] ? item.Dividendos['Retorno de dividendos'] : 'Não possui';       
      }
      row.Link = item.Link;
      return row;
    });
  }
}

module.exports = Excel;