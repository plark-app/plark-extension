import {Dictionary} from "lodash";

import {Transaction} from './Components/Transaction';
import {ResetWallet} from './Components/ResetWallet';
import {ExchangeModal} from './Components/Exchange';

export interface ModalInfoInterface {
    component: any
}

export enum ModalType {
    Transaction = 'TRANSACTION',
    ResetWallet = 'RESET_WALLET',
    Exchange = 'EXCHANGE'
}


export const modalList: Dictionary<ModalInfoInterface> = {
    [ModalType.Transaction]: {
        component: Transaction
    },

    [ModalType.ResetWallet]: {
        component: ResetWallet
    },

    [ModalType.Exchange]: {
        component: ExchangeModal
    }
};