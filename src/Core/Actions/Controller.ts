export enum StartUpEvent {
    Prepare = 'START_UP::PREPARE'
}

export enum TickerEvent {
    ChangeCurrentFiat = 'TICKER::CHANGE_CURRENT_FIAT'
}

export enum WalletEvent {
    ActivateCoin = 'WALLET::ACTIVATE_COIN',
    DisActivateCoin = 'WALLET::DIS_ACTIVATE_COIN',
    CreateTransaction = 'WALLET::CREATE_TRANSACTION',
    CalculateFee = 'WALLET::CALCULATE_FEE'
}

export enum KeyringEvent {
    TryPassword = 'KEYRING::TRY_PASSWORD',
    CheckSeed = 'KEYRING::CHECK_SEED',
    GetSeed = 'KEYRING::GET_SEED',
    SetNewPasscode = 'KEYRING::SET_NEW_PASSWORD'
}

export enum GlobalEvent {
    ClearAllData = 'GLOBAL::CLEAR_ALL_DATA'
}

export enum OptionEvent {
    SetFee = 'OPTION::SET_FEE'
}

export enum Exchange {
    GetPair = 'EXCHANGE::GET_PAIR',
    TryExchange = 'EXCHANGE::TRY_EXCHANGE'
}