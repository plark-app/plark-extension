const sjcl = require('sjcl');

import {VaultDataInterface} from './Entityes';
import {InvalidPasswordException} from './Exceptions';
import {SeedVaultProvider} from './SeedVaultProvider';

function generateSeedVault(seed: string[], password: string): SeedVaultProvider {
    const vaultData: VaultDataInterface = <VaultDataInterface>{};

    vaultData.salt = '';

    const passwordHashOut = sjcl.hash.sha256.hash(password);
    vaultData.ph = sjcl.codec.hex.fromBits(passwordHashOut);

    const seedString = seed.join(' ');
    const seedHashOut = sjcl.hash.sha256.hash(seedString);
    vaultData.sh = sjcl.codec.hex.fromBits(seedHashOut);

    vaultData.seed = sjcl.encrypt(password, seedString);

    return new SeedVaultProvider(vaultData);
}


export {
    SeedVaultProvider,

    VaultDataInterface,

    generateSeedVault,

    InvalidPasswordException
}