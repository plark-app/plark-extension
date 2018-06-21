import {IWelcomeStore} from 'Core/Declarations/Store/Welcome';
import {IGlobalStore} from 'Core/Declarations/Store/Global';
import {ICoinStore} from 'Core/Declarations/Store/Coin';
import {ITermsStore} from 'Core/Declarations/Store/Terms';
import {IKeyringStore} from 'Core/Declarations/Store/Keyring';
import {IWalletStore} from 'Core/Declarations/Store/Wallet';
import {IOptionStore} from 'Core/Declarations/Store/Option';

declare global {
    namespace Store {
        interface IStore {
            Welcome: IWelcomeStore
            Global: IGlobalStore
            Coin: ICoinStore
            Keyring: IKeyringStore
            Terms: ITermsStore,
            Wallet: IWalletStore,
            Option: IOptionStore
        }
    }
}
