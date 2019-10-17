import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import config from 'Config';
import { fetchPrice } from 'Actions/index.js';
import styles from './CoinPrices.scss';

import CoinPairPrices from './CoinPairPrices/CoinPairPrices';

function CoinPrices() {

  const [ displayPairs, setDisplayPairs ] = useState('')
  const { tradingSymbolPair } = useParams()

  useEffect(() => {
    fetchPairs()
    }, [displayPairs]
  )

  const fetchPairs = () => {
    const url = `${config.API_BASE_URL}/pair`
    const popularCoins = config.POPULAR_COINS

    axios
      .get(url)
      .then(({ data: tradingPairs }) => {
        const [{ base: depositCoin }] = tradingPairs.filter(
          pair => pair.name === tradingSymbolPair
        )
        const allMatchPairs = tradingPairs.filter(
          pair => pair.base === depositCoin
        )

        const displayPairs = allMatchPairs.filter(
          pair => popularCoins.includes(pair.quote)
        )
        setDisplayPairs(displayPairs)
      })
      .catch(error => {
        console.log(error)
      })
  }

  // const displayPairsBaseAndQuote = displayPairs.map(
  //   pair => pair.name
      // const container = {};

      // container[pair.name] = item.name;

      // return container
  // )
  // console.log(displayPairsBaseAndQuote)

  return (
    <React.Fragment>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className="container">
            <a>{JSON.stringify(displayPairs.__proto__)}</a>
            {/* {displayPairs.map(({ name }) => (
              <a>{name}</a>
            ))} */}
            <CoinPairPrices tradingSymbolPair="BTCUSD" />
          </div>
        </div>
      </div>
    </React.Fragment>
    )
  }

  const mapStateToProps = ({ selectedCoin, amounts, price }) => ({ selectedCoin, amounts, price });
  const mapDispatchToProps = dispatch => bindActionCreators({ fetchPrice }, dispatch);

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(CoinPrices);
