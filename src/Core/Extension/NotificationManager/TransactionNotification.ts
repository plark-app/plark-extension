import {Wallet} from '@berrywallet/core';
import {Coins} from 'Core';
import Extberry from 'extberry';
import {AbstractNotification} from "./IBerryNotification";

export class TransactionNotification extends AbstractNotification {
    constructor(protected readonly coin: Coins.CoinInterface,
                protected readonly tx: Wallet.Entity.WalletTransaction,
                protected readonly amount: number) {
        super();
    }

    getNotificationId(): string {
        return `tx:${this.coin.getKey()}:${this.tx.txid}`;
    }

    getClickEvent(): () => void {
        return () => {
            Extberry.tabs.create({
                url: this.coin.generateTxLink(this.tx.txid)
            });
        };
    }

    protected getTitle(): string {
        return `Received ${this.amount} ${this.coin.getName()}`;
    }

    protected getMessage(): string {
        return `You've received new transaction with TXID: ${this.tx.txid}`;
    }

    protected generateOtherOptions(): chrome.notifications.NotificationOptions {
        return {
            isClickable: true
        };
    }
}
