const axios = require('axios')
const iconv = require('iconv-lite');
const Cheerio = require('cheerio');
const { formatCurrency } = require('../utils/');

class Investidor10 {
  constructor(args) {
    this.valueToInvest = args.valueToInvest || 1000;
  }


  async loadPage(link) {
    const response = await axios({ url: link, method: 'GET', responseType: 'arraybuffer' });
    const decodedContent = iconv.decode(response.data, 'utf-8');
    return decodedContent
  }

  async _transformPageInJson(link) {
    const page = await this.loadPage(link);
    const $ = Cheerio.load(page);
    const tableFII = $("#table-dividends-history")

    const columns = [];
    tableFII.find('thead tr th').each((i, elem) => { columns.push($(elem).text().trim()); });

    const result = [];
    tableFII.find('tbody tr').each((i, elem) => {
      const row = {};
      $(elem).find('td').each((j, cell) => {
        const key = columns[j];
        row[key] = $(cell).text().trim();
      });
      result.push(row);
    });
    return result;
  }


  async _sanitizeData(link) {
    const data = await this._transformPageInJson(link)
    return data.map(item => {
      let newItem = {};

      for (let key in item) {
        let value = item[key];
        if (typeof value === 'string' && value.includes('%')) {
          newItem[key] = parseFloat(value.replace('%', '').replace(',', '.'));
        }
        else if (typeof value === 'string' && /^[0-9,.]+$/.test(value)) {
          newItem[key] = parseFloat(value.replace(/\./g, '').replace(',', '.'));
        }
        else {
          newItem[key] = value;
        }
      }
      return newItem;
    });
  }

  async getDividendsHistory(fii) { return this._sanitizeData(fii.Link); }

  async getLastDividend(fii) {
    const dividends = await this._sanitizeData(fii.Link);
    const lastDividend = dividends[0]
    const quotaValue = Number(lastDividend['Valor'].toFixed(2))
    const countPapelToBuy = Number((this.valueToInvest / fii['Cotação']).toFixed(0));
    const quotaValueForInvest = countPapelToBuy * quotaValue;

    lastDividend['Qtde de papel'] = countPapelToBuy
    lastDividend['Valor para investir'] = formatCurrency(this.valueToInvest);
    lastDividend['Valor'] = formatCurrency(quotaValue);
    lastDividend['Retorno de dividendos'] = formatCurrency(quotaValueForInvest);
    return lastDividend
  }
}

module.exports = Investidor10;