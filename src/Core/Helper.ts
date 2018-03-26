import {TransactionStatus} from "Core/Service/Wallet";
import {Wallet} from '@berrywallet/core';

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