const FII = require('./services/FII.js')
const Investidor10 = require('./services/Investidor10')
const Excel = require('./services/Excel');
const sleep = require('./services/sleep.js');

async function run() {
  const Fii = new FII();
  const resultFiis = await Fii.getFIIs({
    'Dividend Yield': ['>=', 4],
    'P/VP': ['range', [0.5, 1.2]],
    'Valor de Mercado': ['>=', 500000000],
    'Vacância Média': ['<=', 30],
    Liquidez: ['>=', 1000000]
  })
  const investidor10 = new Investidor10()
  console.log(`Foram encontrados: ${resultFiis.length} FII`)
  for (const fii of resultFiis) {
    console.log('Buscando dados do FII:', fii.Papel)
    const dividends = await investidor10.getDividendsHistory(fii.Link)
    const lastDividend = dividends[0]
    fii.Dividendos = lastDividend
    sleep(1000)
    break;
  }
  const xlsx = new Excel()
  xlsx.arrayToSheet(resultFiis)
}

run()
