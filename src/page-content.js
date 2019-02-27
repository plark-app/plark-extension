// import * as BerryWalletCore from '@plark/wallet-core';
// const BIP39 = require('bip39');

// let mnemonic = BIP39.generateMnemonic(128)
// let seedMnemonic = BIP39.mnemonicToSeed('spoon please page humble margin ridge hurt dry actress month unable small patch rack power');

// console.log("It's a extension script LOG!")
// const myFirstBitcoin = new BerryWalletCore.Coin.Defined.Bitcoin();
// let privateBtc = myFirstBitcoin.makePrivateFromSeed(seedMnemonic);

// console.log(getPrivateKey(privateBtc).toString());
// console.log(mnemonic);

// let privateBtcWithoutPassword = myFirstBitcoin.makePrivateFromSeed(BIP39.mnemonicToSeed(mnemonic));
// let privateBtcPassword = myFirstBitcoin.makePrivateFromSeed(BIP39.mnemonicToSeed(mnemonic, '12345'));

// console.log("No password:", getPrivateKey(privateBtcWithoutPassword).toString())
// console.log("Password '12345':", getPrivateKey(privateBtcPassword).toString())

// function getPrivateKey(privateKey, index = 10) {
//     return privateKey.derive(BerryWalletCore.HD.BIP44.AddressType.RECEIVE, index).getPrivateKey()
// }