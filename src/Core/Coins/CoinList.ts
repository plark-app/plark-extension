import { Dictionary } from 'lodash';
import { CoinInterface } from './Interfaces';

import { CoinSymbol } from './Symbols';

import Bitcoin from './CoinUnits/Bitcoin';
import Dash from './CoinUnits/Dash';
import Ethereum from './CoinUnits/Ethereum';
import Litecoin from './CoinUnits/Litecoin';

import BitcoinTest from './CoinUnits/BitcoinTest';
import DashTest from './CoinUnits/DashTest';
import EthereumTest from './CoinUnits/EthereumTest';
import LitecoinTest from './CoinUnits/LitecoinTest';


const coinList: Dictionary<CoinInterface> = {};

coinList[CoinSymbol.Bitcoin] = new Bitcoin;
coinList[CoinSymbol.Ethereum] = new Ethereum;
coinList[CoinSymbol.Dash] = new Dash;
coinList[CoinSymbol.Litecoin] = new Litecoin;

// Test networks
coinList[CoinSymbol.BitcoinTest] = new BitcoinTest;
coinList[CoinSymbol.EthereumTest] = new EthereumTest;
coinList[CoinSymbol.DashTest] = new DashTest;
coinList[CoinSymbol.LitecoinTest] = new LitecoinTest;


export { coinList };