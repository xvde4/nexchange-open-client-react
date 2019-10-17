import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import config from 'Config';
import { fetchPrice } from 'Actions/index.js';
import styles from './CoinPairPrices.scss';

function CoinPairPrices({ tradingSymbolPair }) {
  const [rate, setRate] = useState('');
  const [change, setChange] = useState('');

  useEffect(() => {
    fetchPrice();

    const timeout = setTimeout(() => { fetchPrice() },
      config.PRICE_FETCH_INTERVAL);

    return () => { clearTimeout(timeout) }
    }, []
  )

  const fetchPrice = () => {
    const url = `${config.API_BASE_URL}/price/${tradingSymbolPair}/latest/`;

    axios
      .get(url)
      .then(response => {
        if (!response.data.length) return;

        const prevRate = rate;
        const newRate = parseFloat(response.data[0].ticker.ask);

        if (prevRate !== '') {
          setChange(newRate > prevRate ? styles.up : styles.down);
        }
        setRate(newRate);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Link to={{ pathname: "/", search: `?pair=${tradingSymbolPair}` }} replace={false}>
      <div className={`${styles['coin-price']} ${change}`}>
        <h5>
          {tradingSymbolPair} <span className={styles.arrow} />
        </h5>
        <h6>{rate ? rate.toFixed(5) : '...'}</h6>
      </div>
    </Link>
  )
}


const mapStateToProps = ({ selectedCoin, amounts, price }) => ({ selectedCoin, amounts, price });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchPrice }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinPairPrices);
