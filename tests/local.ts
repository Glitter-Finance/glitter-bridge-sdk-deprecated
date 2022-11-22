
import algosdk from 'algosdk';
import path from 'path';
import { Networks } from '../src/networks/GlitterNetwork';
import GlitterBridgeSDK from '../src/GlitterBridgeSDK';
import * as solanaWeb3 from "@solana/web3.js";
import {AlgorandAccounts} from 'glitter-bridge-algorand/lib/accounts';
import {SolanaAccounts} from 'glitter-bridge-solana/lib/accounts';

run()

async function run() {
    const result = await runMain();
    console.log(result);
}

async function runMain(): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            
            const glitterBridgeSdk = new GlitterBridgeSDK()
                .setRootDirectory(path.join(__dirname, ".."))
                .loadLogger(path.basename(__filename))
                .setEnvironment(Networks.testnet)
                .connectToAlgorand()
                .connectToSolana()

                //Load Local Algorand Accounts
            AlgorandAccounts.add(process.env.DEV_ALGORAND_ACCOUNT_TEST, glitterBridgeSdk.logger);
            SolanaAccounts.add(process.env.DEV_SOLANA_ACCOUNT_TEST, glitterBridgeSdk.logger);


            let testKey = ;
            if (!testKey) {
                throw new Error('DEV_ALGORAND_ACCOUNT_TEST not set');
            }
            const algorand_testAccount = algosdk.mnemonicToSecretKey(testKey);
            console.log('testAccount {}', algorand_testAccount);

            //Load Local Solana Accounts
            testKey = process.env.DEV_SOLANA_ACCOUNT_TEST;
            

            console.log(`============ setup Solana Wallet:  ${solWallet.publicKey} =================`)


            resolve(true);

        } catch (error) {
            reject(error);
        }
    });

}





