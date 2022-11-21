
import algosdk from 'algosdk';
import path from 'path';
import { Networks } from '../src/networks/GlitterNetwork';
import GlitterBridgeSDK from '../src/GlitterBridgeSDK';
import * as solanaWeb3 from "@solana/web3.js";


run()

async function run() {
    const result = await runMain();
    console.log(result);
}

async function runMain(): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {

            //Load Local Algorand Accounts
            let testKey = process.env.DEV_ALGORAND_ACCOUNT_TEST;
            if (!testKey) {
                throw new Error('DEV_ALGORAND_ACCOUNT_TEST not set');
            }
            const algorand_testAccount = algosdk.mnemonicToSecretKey(testKey);
            console.log('testAccount {}', algorand_testAccount);

            //Load Local Solana Accounts
            testKey = process.env.DEV_SOLANA_ACCOUNT_TEST;
            

            console.log(`============ setup Solana Wallet:  ${solWallet.publicKey} =================`)

            const solana_testAccont = solanaWeb3;

            const glitterBridgeSdk = new GlitterBridgeSDK()
                .setRootDirectory(path.join(__dirname, ".."))
                .setEnvironment(Networks.testnet)
                .connectToAlgorand()
                .connectToSolana()

            resolve(true);

        } catch (error) {
            reject(error);
        }
    });

}





