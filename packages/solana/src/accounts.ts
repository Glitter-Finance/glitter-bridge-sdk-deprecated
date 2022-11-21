import * as bip39 from 'bip39';
import * as nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import * as solanaWeb3 from "@solana/web3.js";
import { Logger } from "glitter-bridge-common/lib/Utils/logger";

export type SolanaAccount = {
    addr: string;
    sk: Uint8Array;
}

export class SolanaAccounts {

    private static _accounts: Record<string, SolanaAccount> = {};
    
    public static async add(mnemonic: string, logger: Logger | undefined): Promise<SolanaAccount> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {

                //Fail Safe
                if (!mnemonic) {
                    throw new Error('DEV_SOLANA_ACCOUNT_TEST not set');
                }

                //Convert seed to Uint8Array
                const sk = await SolanaAccounts.mnemonicToSecretKey(mnemonic);
                if (!sk) {
                    throw new Error('Solana Key not found');
                }

                //Get Wallet
                const solWallet = solanaWeb3.Keypair.fromSecretKey(sk);
                if (!solWallet) {
                    throw new Error('Solana Wallet not found');
                }

                //Convert to account
                const solAccount:SolanaAccount = {
                    addr: solWallet.publicKey.toString(),
                    sk: sk
                }

                //Add to accounts
                SolanaAccounts._accounts[solAccount.addr] = solAccount;

                //Log
                logger?.log(`Added Solana Wallet:  ${solAccount.addr}`)

                //Return
                resolve(solAccount);

            } catch (error) {
                reject(error);
            }
        });
    }

    public static async mnemonicToSecretKey(mnemonic: string): Promise<Uint8Array> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {

                //Fail Safe
                if (!mnemonic) {
                    throw new Error('DEV_SOLANA_ACCOUNT_TEST not set');
                }

                //Convert seed to Uint8Array
                const seed = await bip39.mnemonicToSeed(mnemonic);
                const seedBuffer = Buffer.from(seed).toString('hex');
                const path44Change = `m/44'/501'/0'/0'`;
                const derivedSeed = derivePath(path44Change, seedBuffer).key

                const sk = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
                if (!sk) {
                    throw new Error('Solana Wallet not found');
                }

                resolve(sk);

            } catch (error) {
                reject(error);
            }
        });
    }
}