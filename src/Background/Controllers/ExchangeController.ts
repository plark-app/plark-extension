import { Store } from 'redux';
import BigNumber from 'bignumber.js';
import { HD, Wallet } from '@berrywallet/core';
import { IStore } from 'Core/Declarations/Store';
import { createBeShapy, BeShapyClient, BeShapyUnits } from 'be-shapy';
import { Controller } from 'Core/Actions';
import { AbstractController } from 'Background/Service/AbstractController';
import { WalletController } from "./WalletController";

import { Analytics } from 'Popup/Service';


export class ExchangeController extends AbstractController {

    beShapy: BeShapyClient;

    public get alias(): string {
        return 'EXCHANGE';
    }

    /**
     * @param {BgController.IBackgroundCore} app
     * @param {Store<IStore>} store
     */
    public constructor(app: BgController.IBackgroundCore, store: Store<IStore>) {
        super(app, store);

        this.beShapy = createBeShapy();

        this.bindEventListener(Controller.Exchange.GetPair, this.getPair);
        this.bindEventListener(Controller.Exchange.TryExchange, this.tryExchange);
    }

    private getPair: EventHandlerType = (request: any): Promise<any> => {
        const { from, to } = request;

        return this.beShapy.getInfo(from, to);
    };

    private tryExchange: EventHandlerType = async (request: any): Promise<Wallet.Entity.WalletTransaction> => {
        const { from, to, value } = request;

        const walletController = this.getApp().get('WALLET') as WalletController;

        const fromWallet = walletController.getWalletManager(from);
        const toWallet = walletController.getWalletManager(to);

        const toAddress = toWallet.getWDProvider().address.last(HD.BIP44.AddressType.RECEIVE);
        const returnAddress = fromWallet.getWDProvider().address.last(HD.BIP44.AddressType.RECEIVE);

        if (!toAddress || !returnAddress) {
            if (!toAddress) {
                throw new Error('Not found to address!');
            }

            if (!returnAddress) {
                throw new Error('Not found from address!');
            }
        }

        const shift: BeShapyUnits.Shift = await this.beShapy.shift(from, to, toAddress.address, returnAddress.address);

        const transaction: Wallet.Entity.WalletTransaction = await walletController.createTransaction({
            coinKey: from,
            address: shift.deposit,
            value: value,
        });

        const pairItem = `${from} to ${to}`;

        try {
            const fromTicker = this.getState().Coin.tickers[from] || { priceUsd: 0 };

            Analytics.trackExchange(
                transaction.txid,
                pairItem,
                new BigNumber(value).mul(fromTicker.priceUsd).mul(0.0025).round(2).toNumber(),
            );
        } catch (error) {
            this.debug('Something wrong with analitics');
        }

        return transaction;
    };
}
