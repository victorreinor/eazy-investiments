const FII = require('./services/FII.js')
const Investidor10 = require('./services/Investidor10')
const Excel = require('./services/Excel');
const { sleep } = require('./utils');

async function run() {
  const Fii = new FII();
  const resultFiis = await Fii.getFIIs({
    'Dividend Yield': ['>=', 0.4],
    'P/VP': ['range', [0.4, 1.2]],
    'Valor de Mercado': ['>=', 500000000],
    'Vacância Média': ['<=', 30],
    Liquidez: ['>=', 1000000]
  })
  const investidor10 = new Investidor10({ valueToInvest: 1000 })
  console.log(`Foram encontrados: ${resultFiis.length} FII`, '\n')
  let count = 1
  for (const fii of resultFiis) {
    console.log(`${count} Buscando dados do FII:`, fii.Papel, '\n')
    const divend = await investidor10.getLastDividend(fii)
    fii.Dividendos = divend
    await sleep(2000)
    count++
  }
  const xlsx = new Excel()
  xlsx.arrayToSheet(resultFiis)
}

run()
