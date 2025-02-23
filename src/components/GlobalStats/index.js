import React from 'react';
import { useMedia } from 'react-use';
import styled from 'styled-components';

import { TYPE } from '../../Theme';
import { useGlobalData, useNativeCurrencyPrice } from '../../contexts/GlobalData';
import { useNativeCurrencySymbol } from '../../contexts/Network';
import { formattedNum, localNumber } from '../../utils';
import { RowFixed, RowBetween } from '../Row';

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
`;

const Medium = styled.span`
  font-weight: 500;
`;

export default function GlobalStats() {
  const below1295 = useMedia('(max-width: 1295px)');
  const below1180 = useMedia('(max-width: 1180px)');
  const below1024 = useMedia('(max-width: 1024px)');
  const below400 = useMedia('(max-width: 400px)');
  const below816 = useMedia('(max-width: 816px)');

  const { oneDayVolumeUSD, oneDayTxns, pairCount } = useGlobalData();
  const nativeCurrencySymbol = useNativeCurrencySymbol();
  const [nativeCurrencyPrice] = useNativeCurrencyPrice();
  const formattedNativeCurrencyPrice = nativeCurrencyPrice ? formattedNum(nativeCurrencyPrice, true) : '-';
  const oneDayFees = oneDayVolumeUSD
    ? // FIXME: just know this is approximated, because each pair can have its own swap fee
      formattedNum(oneDayVolumeUSD * 0.0025, true)
    : '';

  return (
    <Header>
      <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
        <RowFixed>
          {!below400 && (
            <TYPE.main mr={'1rem'} style={{ position: 'relative' }}>
              {nativeCurrencySymbol} Price: <Medium>{formattedNativeCurrencyPrice}</Medium>
            </TYPE.main>
          )}

          {!below1180 && (
            <TYPE.main mr={'1rem'}>
              Transactions (24H): <Medium>{localNumber(oneDayTxns)}</Medium>
            </TYPE.main>
          )}
          {!below1024 && (
            <TYPE.main mr={'1rem'}>
              Pairs: <Medium>{localNumber(pairCount)}</Medium>
            </TYPE.main>
          )}
          {!below1295 && (
            <TYPE.main mr={'1rem'}>
              Fees (24H): <Medium>{oneDayFees}</Medium>&nbsp;
            </TYPE.main>
          )}
        </RowFixed>
      </RowBetween>
    </Header>
  );
}
