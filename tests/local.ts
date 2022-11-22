
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

            console.log("Algorand: "  + process.env.DEV_ALGORAND_ACCOUNT_TEST)
            console.log("Solana: "  +  process.env.DEV_SOLANA_ACCOUNT_TEST)

                //Load Local Algorand Accounts
            const algoAccount = AlgorandAccounts.add(process.env.DEV_ALGORAND_ACCOUNT_TEST, glitterBridgeSdk.logger);
            const SolAccount = await SolanaAccounts.add(process.env.DEV_SOLANA_ACCOUNT_TEST, glitterBridgeSdk.logger);

            console.log(`============ Setup Algorand Wallet:  ${algoAccount?.addr} =================`)
            console.log(`============ Setup Solana Wallet:  ${SolAccount?.addr} =================`)
            resolve(true);

        } catch (error) {
            reject(error);
        }
    });

}


