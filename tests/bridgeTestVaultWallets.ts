
import * as path from 'path';
import { Networks } from '../src/configs/GlitterConfigs';
import GlitterBridgeSDK, { BridgeNetworks } from '../src/GlitterBridgeSDK';
import { AlgorandAccounts } from 'glitter-bridge-algorand/lib/accounts';
import { SolanaAccounts } from 'glitter-bridge-solana/lib/accounts';
import * as util from "util";


run()

async function run() {
    const result = await runMain();
    console.log(result);
}

async function runMain(): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {

            const sdk = new GlitterBridgeSDK()
                .setRootDirectory(path.join(__dirname, ".."))
                .setEnvironment(Networks.testnet)
                .connect([BridgeNetworks.algorand, BridgeNetworks.solana]);

            const logger = sdk.logger;

            //Load Local Algorand Accounts    
            let algoAccount = await AlgorandAccounts.add(process.env.DEV_ALGORAND_ACCOUNT_TEST);
            algoAccount = await AlgorandAccounts.updateAccountDetails(algoAccount, true);
            let solAccount = await SolanaAccounts.add(process.env.DEV_SOLANA_ACCOUNT_TEST);
            solAccount = await SolanaAccounts.updateAccountDetails(solAccount, true);

            console.log(util.inspect(solAccount, false, 5, true /* enable colors */));

            console.log(`============ Setup Algorand Wallet:  ${algoAccount?.addr} =================`)
            console.log(`============ Setup Solana Wallet:  ${solAccount?.addr} =================`)

            if (!algoAccount || !solAccount) throw console.error("Failed to load accounts");

            //Check network health
            const health = await sdk.algorand?.checkHealth();
            logger?.log(`Algorand Health: ${util.inspect(health, false, 5, true /* enable colors */)}`);
            const version = await sdk.algorand?.checkVersion();
            logger?.log(`Algorand Version: ${util.inspect(version, false, 5, true /* enable colors */)}`);

            //Create new solana account
            const newSolAccount = await SolanaAccounts.createNew();
            console.log(util.inspect(newSolAccount, false, 5, true /* enable colors */));

            //Fund Account
            const fundResult = await SolanaAccounts.fundAccount(solAccount, newSolAccount, 0.1);
            const optin = await SolanaAccounts.optinAsset(newSolAccount, "xALGO");

            //Close Accounts
            //const closeTokenAccount = await SolanaAccounts.closeOutAsset(newSolAccount, "xALGO", solAccount.addr);
            //const closeAccount = await SolanaAccounts.closeAccount(newSolAccount, solAccount.addr);

            // //Create new algorand account
            // const newAlgoAccount = await AlgorandAccounts.createNew();
            // console.log(util.inspect(newAlgoAccount, false, 5, true /* enable colors */));

            // //Fund Account
            // const fundResult = await AlgorandAccounts.fundAccount(algoAccount, newAlgoAccount, 6);
            // const optin = await AlgorandAccounts.optinAsset(newAlgoAccount, "xSOL");
            // const sendToken = await AlgorandAccounts.fundAccountToken(algoAccount, newAlgoAccount, 1, "xSOL");

            // try {
            //     //Bridge Algo
            //     const bridgeAlgo = await AlgorandAccounts.bridge(newAlgoAccount, "Algo", "Solana", solAccount.addr, "xAlgo", 5);
            //     const bridgexSOL = await AlgorandAccounts.bridge(newAlgoAccount, "xSOL", "Solana", solAccount.addr, "Sol", 0.05);

            // } catch (e) {
            //     console.log(e);
            // }

            // //Close New Account
            // const closeTokenAccount = await AlgorandAccounts.closeOutAsset(newAlgoAccount, "xSOL", algoAccount.addr);
            // const closeAccount = await AlgorandAccounts.closeAccount(newAlgoAccount, algoAccount.addr);

            resolve(true);

        } catch (error) {
            reject(error);
        }
    });

}


