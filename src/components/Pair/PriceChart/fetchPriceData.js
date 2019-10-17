import config from 'Config';
import axios from 'axios';

const fetchPriceData = (initialFetch=false, tradingSymbolPair) => {

  const data_points = 5
  const hours = 1
  const market = 'nex'
  const priceHistoryURL = (
    `${config.API_BASE_URL}`
    + `/price/${tradingSymbolPair}/history/`
    + `?hours=${hours}`
    + `&data_points=${data_points}`
    + `&market_code=${market}`
  )

  const latestPriceURL = (`${config.API_BASE_URL}/price/${tradingSymbolPair}/latest/`)

  axios
    .get(initialFetch ? priceHistoryURL : latestPriceURL)
    .then(({ data: priceData }) => {
      console.log(priceData)

      const timestamps = priceData.map(
        point => point.unix_time
      ).map(
        time => moment.unix(time).format("HH:mm")
      )

      const askPrices = priceData.map(
        point => point.ticker.ask
      )

      console.log( { timestamps, askPrices } )
      return { timestamps, askPrices }
    })
    .catch(error => {
      console.log(error)
    })
}

export default fetchPriceData