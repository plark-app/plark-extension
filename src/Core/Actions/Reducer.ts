export enum WelcomeAction {
    Clear = 'WELCOME::CLEAR',
    SetSeed = 'WELCOME::SET_SEED',
    ClearSeed = 'WELCOME::CLEAR_SEED',
    SetPasscode = 'WELCOME::SET_PASSCODE',
    ClearPasscode = 'WELCOME::CLEAR_PASSCODE',
    SetCoins = 'WELCOME::SET_COINS',
    ClearCoins = 'WELCOME::SET_COINS',
    SetLocation = 'WELCOME::SET_LOCATION'
}

export enum GlobalAction {
    Increment = 'GLOBAL::INCREMENT',
    WalletReady = 'GLOBAL::WALLET_READY',
    WalletReset = 'GLOBAL::WALLET_RESET',
    SetLocation = 'GLOBAL::SET_LOCATION',

    ClearAllData = 'GLOBAL::CLEAR_ALL_DATA'
}

export enum KeyringAction {
    SetSeedVault = 'KEYRING::SET_SEED_VAULT',
    ClearSeedVault = 'KEYRING::CLEAR_SEED_VAULT',

    NeedPassword = 'KEYRING::NEED_PASSWORD',
    HasPassword = 'KEYRING::HAS_PASSWORD'
}

export enum CoinAction {
    SetCoins = 'COIN::SET_COINS',
    ClearCoins = 'COIN::CLEAR_COINS',
    SetTickers = 'COIN::SET_TICKERS',
    SetCurrentFiat = 'COIN::SET_CURRENT_FIAT',
    SetCurrentCoin = 'COIN::SET_CURRENT_COIN',
    SetBlockHeight = 'COIN::SET_BLOCK_HEIGHT'
}

export enum TermsAction {
    Agree = 'TERMS::AGREE'
}

export enum WalletAction {
    InitWallet = 'WALLET::INIT',
    Activate = 'WALLET::ACTIVATE',
    SetWalletData = 'WALLET::SET_WALLET_DATA',

    StartLoading = 'WALLET::START_LOADING',
    StopLoading = 'WALLET::STOP_LOADING'
}

export enum OptionAction {
    SetFee = 'OPTION::SET_FEE'
}