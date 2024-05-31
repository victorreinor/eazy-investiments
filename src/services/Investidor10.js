const env = require('./../../env.js')
const axios = require('axios')
const fs = require('fs');
const { promisify } = require('util');
const iconv = require('iconv-lite');
const Cheerio = require('cheerio')

class Investidor10 {
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
    tableFII.find('thead tr th').each((i, elem) => {
      columns.push($(elem).text().trim());
    });

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

  async getDividendsHistory(link) {
    return await this._sanitizeData(link);
  }
}

module.exports = Investidor10;