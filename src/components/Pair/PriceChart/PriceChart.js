import React, { useEffect, useParams, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchPrice } from 'Actions/index.js';
import config from 'Config';
import styles from './PriceChart.scss';
import ChartistGraph from 'react-chartist';
import moment from 'moment';

import fetchPriceData from './fetchPriceData';


function PriceChart() {

  const tradingSymbolPair = 'BTCUSD'
  // const { tradingSymbolPair } = useParams()
  const fetchInterval = 5000
  // const fetchInterval = config.PRICE_FETCH_INTERVAL

  const [ lineChartData, setLineChartData ] = useState(() => {
    return fetchPriceData({ initialFetch: true, tradingSymbolPair })
  })


  // https://github.com/fraserxu/react-chartist
  // TODO Set Low and High as appropriate for the coin pair
  const lineChartOptions = {
    high: 10000,
    low: 5000,
    axisX: {
      labelInterpolateFnc: function(value, index) {
        return index % 2 === 0 ? value : null;
      }
    }
  }
  const lineChartType = 'Line'

  useEffect(() => {
    console.log(fetchInterval)

    const timeout = setTimeout(() => {
      const { latestTimestamp, latestAskPrice } = fetchPriceData(
        { initialFetch: false, tradingSymbolPair }
      )
      console.log('ran')
      console.log(latestTimestamp)
      console.log(latestAskPrice)
      console.log(lineChartData)
      // const { labels: prevTimestamps, series: prevTimestamps} = lineChartData
      // const dropFirst = 1
      // setLineChartData({
      //     labels: [ ...prevTimestamps.slice(dropFirst,), latestTimestamp ],
      //     series: [ ...prevAskPrices.slice(dropFirst,), latestAskPrice ]
      // })
    }, fetchInterval);
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={styles.container}>
      <ChartistGraph data={ lineChartData } options={ lineChartOptions } type={ lineChartType } />
    </div>
  )
}

const mapStateToProps = ({ selectedCoin, amounts, price }) => ({ selectedCoin, amounts, price });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchPrice }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceChart)
