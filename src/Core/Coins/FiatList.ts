import { Dictionary } from 'lodash';
import { FiatData } from './Interfaces';
import { FiatSymbol } from './Symbols';

export const fiatList: Dictionary<FiatData> = {
    [FiatSymbol.USDollar]: {
        key: FiatSymbol.USDollar,
        name: 'U.S. Dollar',
        shortName: 'Dollar',
        prefix: '$',
        format: '0,0.00',
    },
    [FiatSymbol.Euro]: {
        key: FiatSymbol.Euro,
        name: 'European Euro',
        shortName: 'Euro',
        prefix: '€',
        format: '0,0.00',
    },
    [FiatSymbol.JPYen]: {
        key: FiatSymbol.JPYen,
        name: 'Japanese Yen',
        shortName: 'Yen',
        prefix: '¥',
        format: '0,0.00',
    },
    [FiatSymbol.GBPound]: {
        key: FiatSymbol.GBPound,
        name: 'British Pound',
        shortName: 'Pound',
        prefix: '£',
        format: '0,0.00',
    },
    [FiatSymbol.CNYuan]: {
        key: FiatSymbol.CNYuan,
        name: 'Chinese Yuan',
        shortName: 'Renminbi',
        prefix: '¥',
        format: '0,0.00',
    },
    [FiatSymbol.UAHryvnia]: {
        key: FiatSymbol.UAHryvnia,
        name: 'Ukrainian Hryvnia',
        shortName: 'Hryvnia',
        prefix: '₴',
        format: '0,0.00',
    },
    [FiatSymbol.AUDollar]: {
        key: FiatSymbol.AUDollar,
        name: 'Australian Dollar',
        shortName: 'AU$',
        prefix: 'AU$',
        format: '0,0.00',
    },
    [FiatSymbol.CADollar]: {
        key: FiatSymbol.CADollar,
        name: 'Canadian Dollar',
        shortName: 'CA$',
        prefix: 'CA$',
        format: '0,0.00',
    },
};
