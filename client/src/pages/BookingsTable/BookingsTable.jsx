import React, { useState, useEffect } from 'react';
import BookingHistoryTable from './BookingHistoryTable';

const menu = [
  {
    name: 'Bitcoin',
    id: 'bitcoin', //coingeko id
    logoUrl:
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    symbol: 'BTC',
    amount: '1.21',
    date: `$31, 688`,
    status: true,
  },
  {
    name: 'Ethereum',
    logoUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    id: 'ethereum', //coingeko id
    symbol: 'ETH',
    amount: '3.25',
    date: `$5,150.37`,
    status: true,
  },

  {
    name: 'Tron',
    logoUrl:
      'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1547035066',
    id: 'tron', //coingeko id
    symbol: 'TRX',
    amount: '1500',
    date: `$1,499.67`,
    status: false,
  },
];

export const BookingsTable = (props) => {
  const { data } = props;

  return (
    <>
      <div className="p-1 w-full">
        <BookingHistoryTable data={data} />
      </div>
    </>
  );
};
