const env = require('./../../env.js')
const axios = require('axios')
const fs = require('fs');
const { promisify } = require('util');
const iconv = require('iconv-lite');
const Cheerio = require('cheerio')


const readFileAsync = promisify(fs.readFile);

class FII {
  constructor() {
    this.url = env.URL_BASE_FII;
  }
  async loadPage() {
    console.log('Buscando todos os FIIs da página:', env.URL_BASE_FII, '\n')
    const response = await axios({ url: env.URL_BASE_FII, method: 'GET', responseType: 'arraybuffer' });
    if (!Buffer.isBuffer(response.data)) throw new Error('Response is not a buffer');
    const decodedContent = iconv.decode(response.data, 'ISO-8859-1');
    fs.writeFileSync('./mocks/fundamentus-fii.html', decodedContent);
    return true
  }

  async _getPage() {
    // if (!env.mock) this.loadPage();
    this.loadPage();
    return await readFileAsync('./mocks/fundamentus-fii.html', 'utf8');
  }

  async _transformPageInJson() {
    const page = await this._getPage();
    const $ = Cheerio.load(page);
    const tableFII = $("#tabelaResultado")

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
        row.Link = `https://investidor10.com.br/fiis/${row['Papel']}/`
      });
      result.push(row);
    });
    return result;
  }

  async sanitizeData() {
    const data = await this._transformPageInJson()
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

  async getFIIs(filters) {
    const Fiis = await this.sanitizeData()
    return Fiis.filter(fii => {
      return Object.keys(filters).every(key => {
        const [condition, value] = filters[key];
        switch (condition) {
          case '>=': return fii[key] >= value;
          case '<=': return fii[key] <= value;
          case '>': return fii[key] > value;
          case '<': return fii[key] < value;
          case '==': return fii[key] == value;
          case '!=': return fii[key] != value;
          case 'range': return fii[key] >= value[0] && fii[key] <= value[1];
          default: return false;
        }
      });
    });
  }
}

module.exports = FII;