import BigNumber from 'bignumber.js';
import { TransactionStatus } from 'Core/Service/Wallet';
import Numeral from 'numeral';
import { Wallet } from '@plark/wallet-core';

/**
 * @param {string} seed
 * @returns {string}
 */
export function normalizeSeed(seed: string): string {
    return seed.replace(/\s+/g, ' ').toLowerCase().trim();
}

/**
 * @param {WalletTransaction} tx
 *
 * @returns {TransactionStatus}
 */
export function getTXStatus(tx: Wallet.Entity.WalletTransaction | Wallet.Entity.EtherTransaction): TransactionStatus {
    if (!tx.blockHeight) {
        return TransactionStatus.Pending;
    }

    if ('receiptStatus' in tx && !tx.receiptStatus) {
        return TransactionStatus.Rejected;
    }

    return TransactionStatus.Confirmed;
}


export function parseStrToBigN(value: string | number | BigNumber | null): BigNumber {
    if (!value) {
        return new BigNumber(0);
    }

    if (value instanceof BigNumber) {
        return value;
    }

    if (typeof value === 'string') {
        return new BigNumber(parseFloat(value.replace(',', '.')) || 0);
    } else if (typeof value === 'number') {
        return new BigNumber(value);
    }

    return new BigNumber(+value);
}


export function renderCoin(number: number | BigNumber): string {
    return Numeral(number).format('0,0.00[000000]');
}

export function renderFiat(number: number | BigNumber): string {
    return Numeral(number).format('0,0.00');
}