
import * as path from 'path';
import {GlitterBridgeSDK, BridgeNetworks } from '../lib/src/GlitterBridgeSDK';
import * as util from "util";
import { GlitterNetworks } from '../lib/src/configs/GlitterConfigs';
import { Sleep } from 'glitter-bridge-common';
import { PublicKey } from '@solana/web3.js';

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
                .setConfigDirectory(path.join(__dirname, "../lib/src/configs"))
                .setEnvironment(GlitterNetworks.testnet)
                .connect([BridgeNetworks.algorand, BridgeNetworks.solana]);

            const algorandAccounts = sdk.algorand?.accounts;
            if (!algorandAccounts) throw new Error("Algorand Accounts not loaded");
            const solanaAccounts = sdk.solana?.accounts;
            if (!solanaAccounts) throw new Error("Solana Accounts not loaded");
            const algorand = sdk.algorand;
            if (!algorand) throw new Error("Algorand not loaded");
            const solana = sdk.solana;
            if (!solana) throw new Error("Solana not loaded");

            //Load Local Algorand Accounts    
            let algoAccount = await algorandAccounts.add(process.env.DEV_ALGORAND_ACCOUNT_TEST);
            algoAccount = await algorandAccounts.updateAccountDetails(algoAccount, true);
            let solAccount = await solanaAccounts.add(process.env.DEV_SOLANA_ACCOUNT_TEST);
            solAccount = await solanaAccounts.updateAccountDetails(solAccount, true);
            if (!algoAccount || !solAccount) throw console.error("Failed to load accounts");           

            console.log(`============ Setup Algorand Wallet:  ${algoAccount?.addr} =================`)
            console.log(`============ Setup Solana Wallet:  ${solAccount?.addr} =================`)
            
            const algoBalance = await algorand.getBalance(algoAccount.addr);
            const solBalance = await solana.getBalance(solAccount.addr);
            console.log(`Algorand Balance: ${algoBalance}`);
            console.log(`Solana Balance: ${solBalance}`);

            const xSolBalance = await algorand.getTokenBalance(algoAccount.addr, "xSol");
            const xAlgoBalance = await solana.getTokenBalance(solAccount.addr, "xAlgo");
            console.log(`xSol Balance: ${xSolBalance}`);
            console.log(`xAlgo Balance: ${xAlgoBalance}`);

            //const solBridge = sdk.solana.bridge(solAccount, "sol", "algorand", algoAccount.addr, "xSOL", 0.05);
            //const algoBridge = 



            //let x = await sdk.solana.bridge(solAccount, "xAlgo", "algorand", algoAccount.addr, "algo", 0.05);


            // //Check network health
            // const health = await sdk.algorand?.checkHealth();
            // console.log(`Algorand Health: ${util.inspect(health, false, 5, true /* enable colors */)}`);
            // const version = await sdk.algorand?.checkVersion();
            // console.log(`Algorand Version: ${util.inspect(version, false, 5, true /* enable colors */)}`);

           

        

            // //Fund Account
            // const fundResult = await sdk.solana?.fundAccount(solAccount, newSolAccount, 0.1);   
            // let balance = await sdk.solana?.waitForBalance(newSolAccount.addr, 0.1,60);
            // console.log(`Balance: ${balance}`);   

            // //Optin to xALGO
            // const optinResult = await sdk.solana?.optinToken(newSolAccount, "xALGO");           
            // balance = await sdk.solana?.waitForBalance(newSolAccount.addr, 0.09795572,60);
            // console.log(`Balance: ${balance}`);   

            // //Fund xALGO
            // const sendToken = await sdk.solana?.fundAccountTokens(solAccount, newSolAccount, 0.05, "xALGO");   
            // const tokenBalance = await sdk.solana?.waitForTokenBalance(newSolAccount.addr, "xALGO",0.05);
            // console.log(`Token Balance: ${tokenBalance}`);             

            // //Close Token Account
            // const closeTokenAccount = await sdk.solana?.closeOutTokenAccount( newSolAccount,solAccount, "xALGO");  

            // balance = await sdk.solana?.waitForBalance(newSolAccount.addr, 0.09794072,60);
            // console.log(`Balance: ${balance}`);   
            // const closeAccount = await sdk.solana?.closeOutAccount( newSolAccount, solAccount);


















            //const optin = await sdk.solana?.optinAsset(newSolAccount, "xALGO");

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


