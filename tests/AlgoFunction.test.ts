// import * as path from 'path';
// import { GlitterNetworks } from '../lib/src/configs/GlitterConfigs';
// import GlitterBridgeSDK, { BridgeNetworks } from '../lib/src/GlitterBridgeSDK';

// import { AlgorandAccount, AlgorandAccounts } from 'glitter-bridge-algorand';
// import { SolanaAccount, SolanaAccounts } from 'glitter-bridge-solana';

// describe("Glitter bridge SDK Test Algorand to Solana", () => {
//     console.log("Start");

//     const sdk = new GlitterBridgeSDK()
//         .setRootDirectory(path.join(__dirname, ".."))
//         .setEnvironment(Networks.testnet)
//         .connect([BridgeNetworks.algorand, BridgeNetworks.solana]);

//     //Load Local Algorand Accounts
//     let algoAccount:AlgorandAccount|undefined = undefined;
//     let SolAccount:SolanaAccount|undefined = undefined;
//     beforeAll(async () => {
//         console.log("Loading Accounts");
        
//         algoAccount= await sdk.algorand?.accounts?.add(process.env.DEV_ALGORAND_ACCOUNT_TEST);
//         await sdk.algorand?.accounts?.updateAccountDetails(algoAccount);

//         console.log(`============ Setup Algorand Wallet:  ${algoAccount?.addr} =================`)

//         SolAccount = await sdk.solana?.accounts?.add(process.env.DEV_SOLANA_ACCOUNT_TEST);
//         console.log(`============ Setup Solana Wallet:  ${SolAccount?.addr} =================`)
   
//         if (!algoAccount || !SolAccount) {
//             throw console.error("Failed to load accounts");
//         }

//         console.log("Finished Loading Accounts");
//     });
   
   

//     test("Inner", async () => {
//         console.log("Finish");

//     });
// });

