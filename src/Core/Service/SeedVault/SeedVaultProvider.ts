const sjcl = require('sjcl');

import {VaultDataInterface} from './Entityes';
import {InvalidPasswordException} from './Exceptions';

export class SeedVaultProvider {
    vaultData: VaultDataInterface;

    constructor(vaultData: VaultDataInterface) {
        this.vaultData = vaultData;
    }

    isValidPassword(password: string): boolean {
        const hashOut = sjcl.hash.sha256.hash(password);

        return this.vaultData.ph === sjcl.codec.hex.fromBits(hashOut);
    }

    isValidSeed(seed: string[]) {
        const hashOut = sjcl.hash.sha256.hash(seed.join(' '));

        return this.vaultData.sh === sjcl.codec.hex.fromBits(hashOut);
    }

    getSeed(password: string): string[] {
        if (!this.isValidPassword(password)) {
            throw new InvalidPasswordException('Invalid Vault password');
        }

        const response: string = sjcl.decrypt(password, this.vaultData.seed);

        return response.split(' ');
    }

    getVaultData(): VaultDataInterface {
        return this.vaultData;
    }
}
