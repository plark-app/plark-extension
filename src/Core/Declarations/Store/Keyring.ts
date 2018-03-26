import {VaultDataInterface} from "Core/Service/SeedVault";

export interface IKeyringStore {
    vault?: VaultDataInterface
    needPassword: boolean
}