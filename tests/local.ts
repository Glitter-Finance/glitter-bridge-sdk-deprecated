
import * as path from 'path';
import { Networks } from '../src/networks/GlitterNetwork';
import GlitterBridgeSDK from '../src/GlitterBridgeSDK';
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
                .loadLogger(path.basename(__filename))
                .setEnvironment(Networks.testnet)
                .connectToAlgorand()
                .connectToSolana()

            const logger = sdk.logger;

            //Load Local Algorand Accounts
            const algoAccount = await AlgorandAccounts.add(process.env.DEV_ALGORAND_ACCOUNT_TEST, sdk.logger, true, true);
            const SolAccount = await SolanaAccounts.add(process.env.DEV_SOLANA_ACCOUNT_TEST, sdk.logger);

            console.log(`============ Setup Algorand Wallet:  ${algoAccount?.addr} =================`)
            console.log(`============ Setup Solana Wallet:  ${SolAccount?.addr} =================`)

            if (!algoAccount || !SolAccount) throw console.error("Failed to load accounts");

            //Check network health
            const health = await sdk.algorand?.checkHealth();
            logger?.log(`Algorand Health: ${util.inspect(health, false, 5, true /* enable colors */)}`);
            const version = await sdk.algorand?.checkVersion();
            logger?.log(`Algorand Version: ${util.inspect(version, false, 5, true /* enable colors */)}`);

            




            resolve(true);

        } catch (error) {
            reject(error);
        }
    });

}


