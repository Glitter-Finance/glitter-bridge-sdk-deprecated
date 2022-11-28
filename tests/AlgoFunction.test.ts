import * as path from 'path';
import { Networks } from '../src/configs/GlitterConfigs';
import GlitterBridgeSDK, { BridgeNetworks } from '../src/GlitterBridgeSDK';

import { AlgorandAccount, AlgorandAccounts } from 'glitter-bridge-algorand/lib/accounts';
import { SolanaAccount, SolanaAccounts } from 'glitter-bridge-solana/lib/accounts';

describe("Glitter bridge SDK Test Algorand to Solana", () => {
    console.log("Start");

    const glitterBridgeSdk = new GlitterBridgeSDK()
        .setRootDirectory(path.join(__dirname, ".."))
        .setEnvironment(Networks.testnet)
        .connect([BridgeNetworks.algorand, BridgeNetworks.solana]);

    //Load Local Algorand Accounts
    let algoAccount:AlgorandAccount|undefined = undefined;
    let SolAccount:SolanaAccount|undefined = undefined;
    beforeAll(async () => {
        console.log("Loading Accounts");
        
        algoAccount= await AlgorandAccounts.add(process.env.DEV_ALGORAND_ACCOUNT_TEST);
        await AlgorandAccounts.updateAccountDetails(algoAccount);

        console.log(`============ Setup Algorand Wallet:  ${algoAccount?.addr} =================`)

        SolAccount = await SolanaAccounts.add(process.env.DEV_SOLANA_ACCOUNT_TEST);
        console.log(`============ Setup Solana Wallet:  ${SolAccount?.addr} =================`)
   
        if (!algoAccount || !SolAccount) {
            throw console.error("Failed to load accounts");
        }

        console.log("Finished Loading Accounts");
    });
   
   

    test("Inner", async () => {
        console.log("Finish");

    });
});

