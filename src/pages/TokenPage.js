import { transparentize } from 'polished';
import React, { useState, useEffect, memo } from 'react';
import 'feather-icons';
import isEqual from 'react-fast-compare';
import { useMedia } from 'react-use';
import { Text } from 'rebass';
import styled from 'styled-components';

import { TYPE, ThemedBackground } from '../Theme';
import { PageWrapper, ContentWrapper } from '../components';
import { ButtonLight, ButtonDark } from '../components/ButtonStyled';
import Column, { AutoColumn } from '../components/Column';
import CopyHelper from '../components/Copy';
import FormattedName from '../components/FormattedName';
import Link, { BasicLink } from '../components/Link';
import Loader from '../components/LocalLoader';
import PairList from '../components/PairList';
import Panel from '../components/Panel';
import { AutoRow, RowBetween, RowFixed } from '../components/Row';
import Search from '../components/Search';
import TokenChart from '../components/TokenChart';
import TokenLogo from '../components/TokenLogo';
import TxnList from '../components/TxnList';
import { useNativeCurrencySymbol, useNativeCurrencyWrapper, useSelectedNetwork } from '../contexts/Network';
import { useDataForList } from '../contexts/PairData';
import { useTokenData, useTokenTransactions, useTokenPairs } from '../contexts/TokenData';
import { useColor } from '../hooks';
import { formattedNum, formattedPercent, getExplorerLink, getPoolLink, getSwapLink, localNumber } from '../utils';

const DashboardWrapper = styled.div`
  width: 100%;
`;

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`;

const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto 1fr;
  column-gap: 30px;
  align-items: start;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`;

function TokenPage({ address }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange,
  } = useTokenData(address);

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0);
  }, []);

  // detect color from token
  const backgroundColor = useColor(id, symbol);

  const allPairs = useTokenPairs(address);

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs);

  // all transactions with this token
  const transactions = useTokenTransactions(address);

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : '';
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : '';

  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUT : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
      ? '$0'
      : '-';

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false);
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false);
  }, [oneDayVolumeUSD]);

  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUT);

  // liquidity
  const liquidity = totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : totalLiquidityUSD === 0 ? '$0' : '-';
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange);

  const below1080 = useMedia('(max-width: 1080px)');
  const below600 = useMedia('(max-width: 600px)');
  const below500 = useMedia('(max-width: 500px)');

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16;
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol;

  const selectedNetwork = useSelectedNetwork();
  const nativeCurrency = useNativeCurrencySymbol();
  const nativeCurrencyWrapper = useNativeCurrencyWrapper();

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }, []);

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.6, backgroundColor)} />

      <ContentWrapper>
        <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start' }}>
          <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
            <TYPE.body>
              <BasicLink to="/tokens">{'Tokens '}</BasicLink>→ {symbol}
              {'  '}
            </TYPE.body>
            <Link style={{ width: 'fit-content' }} external href={getExplorerLink(selectedNetwork, address, 'address')}>
              <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                ({address.slice(0, 8) + '...' + address.slice(36, 42)})
              </Text>
            </Link>
          </AutoRow>
          {!below600 && <Search small={true} />}
        </RowBetween>

        <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
          <RowBetween
            style={{
              flexWrap: 'wrap',
              marginBottom: '2rem',
              alignItems: 'flex-start',
            }}
          >
            <RowFixed style={{ flexWrap: 'wrap' }}>
              <RowFixed style={{ alignItems: 'baseline' }}>
                <TokenLogo address={address} defaultText={symbol} size="32px" style={{ alignSelf: 'center' }} />
                <TYPE.main fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                  <RowFixed gap="6px">
                    <FormattedName text={name ? name + ' ' : ''} maxCharacters={16} style={{ marginRight: '6px' }} />{' '}
                    {formattedSymbol ? `(${formattedSymbol})` : ''}
                  </RowFixed>
                </TYPE.main>{' '}
                {!below1080 && (
                  <>
                    <TYPE.main fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                      {price}
                    </TYPE.main>
                    {priceChange}
                  </>
                )}
              </RowFixed>
            </RowFixed>
            <span>
              <RowFixed ml={below500 ? '0' : '2.5rem'} mt={below500 ? '1rem' : '0'}>
                <Link href={getPoolLink(selectedNetwork, nativeCurrency, nativeCurrencyWrapper, address)} external>
                  <ButtonLight>+ Add Liquidity</ButtonLight>
                </Link>
                <Link href={getSwapLink(selectedNetwork, nativeCurrency, nativeCurrencyWrapper, address)} external>
                  <ButtonDark ml={'.5rem'} mr={below1080 && '.5rem'}>
                    Trade
                  </ButtonDark>
                </Link>
              </RowFixed>
            </span>
          </RowBetween>

          <>
            <PanelWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
              {below1080 && price && (
                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Price</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      {' '}
                      <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {price}
                      </TYPE.main>
                      <TYPE.main>{priceChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
              )}
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Total Liquidity</TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {liquidity}
                    </TYPE.main>
                    <TYPE.main>{liquidityChange}</TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Volume (24hrs) {usingUtVolume && '(Untracked)'}</TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {volume}
                    </TYPE.main>
                    <TYPE.main>{volumeChange}</TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>

              <Panel>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <TYPE.main>Transactions (24hrs)</TYPE.main>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {oneDayTxns ? localNumber(oneDayTxns) : oneDayTxns === 0 ? 0 : '-'}
                    </TYPE.main>
                    <TYPE.main>{txnChangeFormatted}</TYPE.main>
                  </RowBetween>
                </AutoColumn>
              </Panel>
              <Panel
                style={{
                  gridColumn: below1080 ? '1' : '2/4',
                  gridRow: below1080 ? '' : '1/4',
                }}
              >
                <TokenChart address={address} color={backgroundColor} base={priceUSD} />
              </Panel>
            </PanelWrapper>
          </>

          <span>
            <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
              Top Pairs
            </TYPE.main>
          </span>
          <Panel
            rounded
            style={{
              marginTop: '1.5rem',
              padding: '1.125rem 0 ',
            }}
          >
            {address && fetchedPairsList ? (
              <PairList color={backgroundColor} address={address} pairs={fetchedPairsList} />
            ) : (
              <Loader />
            )}
          </Panel>
          <RowBetween mt={40} mb={'1rem'}>
            <TYPE.main fontSize={'1.125rem'}>Transactions</TYPE.main> <div />
          </RowBetween>
          <Panel rounded>
            {transactions ? <TxnList color={backgroundColor} transactions={transactions} /> : <Loader />}
          </Panel>
          <>
            <RowBetween style={{ marginTop: '3rem' }}>
              <TYPE.main fontSize={'1.125rem'}>Token Information</TYPE.main>{' '}
            </RowBetween>
            <Panel
              rounded
              style={{
                marginTop: '1.5rem',
              }}
              p={20}
            >
              <TokenDetailsLayout>
                <Column>
                  <TYPE.main>Symbol</TYPE.main>
                  <Text style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                    <FormattedName text={symbol} maxCharacters={12} />
                  </Text>
                </Column>
                <Column>
                  <TYPE.main>Name</TYPE.main>
                  <TYPE.main style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                    <FormattedName text={name} maxCharacters={16} />
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Address</TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                      {address.slice(0, 8) + '...' + address.slice(36, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={address} />
                  </AutoRow>
                </Column>
                <ButtonLight>
                  <Link external href={getExplorerLink(selectedNetwork, address, 'token')}>
                    View on block explorer ↗
                  </Link>
                </ButtonLight>
              </TokenDetailsLayout>
            </Panel>
          </>
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}

export default memo(TokenPage, isEqual);
