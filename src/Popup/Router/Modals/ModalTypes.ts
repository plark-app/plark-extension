import {Dictionary} from "lodash";

import Transaction from './Components/Transaction';
import ResetWallet from './Components/ResetWallet';

interface ModalInfoInterface {
    component: any
}

enum ModalType {
    Transaction = 'TRANSACTION',
    ResetWallet = 'RESET_WALLET'
}


const modalList: Dictionary<ModalInfoInterface> = {
    [ModalType.Transaction]: {
        component: Transaction
    },
    [ModalType.ResetWallet]: {
        component: ResetWallet
    }
};

export {
    ModalInfoInterface,
    ModalType,

    modalList
}