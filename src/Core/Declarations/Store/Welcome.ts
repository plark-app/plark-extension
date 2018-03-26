import {CoinSymbol} from "Core/Coins";

export interface IWelcomeStore {
    location?: string
    seed?: string
    passcode?: string
    coins: CoinSymbol[]
}