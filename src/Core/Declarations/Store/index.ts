import {IWelcomeStore} from './Welcome';
import {IGlobalStore} from './Global';
import {ICoinStore} from './Coin';
import {ITermsStore} from './Terms';
import {IKeyringStore} from './Keyring';
import {IWalletStore} from './Wallet';
import {IOptionStore} from './Option';

export interface IStore {
    Welcome: IWelcomeStore
    Global: IGlobalStore
    Coin: ICoinStore
    Keyring: IKeyringStore
    Terms: ITermsStore,
    Wallet: IWalletStore,
    Option: IOptionStore
}

export {
    IGlobalStore,
    IWelcomeStore,
    ICoinStore,
    ITermsStore,
    IKeyringStore,
    IWalletStore,
    IOptionStore
}
