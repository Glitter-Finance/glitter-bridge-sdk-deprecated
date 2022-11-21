const { default: algosdk } = require('algosdk');
import { Account, Algodv2, Transaction } from "algosdk";
import { RoutingData } from "glitter-bridge-common/lib/routing";
import { TokenInfo } from "glitter-bridge-common/lib/tokens";
import { Logger } from "glitter-bridge-common/lib/Utils/logger";

export class AlgorandTransactions {

    //Txn Definitions
    static async algoSendTransaction(client: Algodv2,
        routing: RoutingData): Promise<Transaction> {
        return new Promise(async (resolve, reject) => {
            try {
                //Get Default Parameters
                let params = await client.getTransactionParams().do();
                params.fee = 1000;
                params.flatFee = true;

                //Encode Note
                var noteString = JSON.stringify(routing);
                let note = algosdk.encodeObj(
                    JSON.stringify({
                        system: noteString,
                        date: `${new Date()}`,
                    })
                );

                let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: params,
                    type: "pay",
                    from: routing.from_address,
                    to: routing.to_address,
                    amount: Number(routing.amount),
                    note: note,
                    closeRemainderTo: undefined,
                    revocationTarget: undefined,
                    rekeyTo: undefined,
                });

                resolve(txn);

            } catch (error) {
                reject(error);
            }
        });

    }
    static async tokenSendTransaction(client: Algodv2,
        routing: RoutingData,
        token: TokenInfo): Promise<Transaction> {
        return new Promise(async (resolve, reject) => {
            try {

                //Get amount
                let amount_bigInt = BigInt(routing.amount * Math.pow(10, token.decimals));

                //Get Default Parameters
                let params = await client.getTransactionParams().do();
                params.fee = 1000;
                params.flatFee = true;

                var assetID = token.asset_id;

                //Encode Note
                var noteString = JSON.stringify(routing);
                let note = algosdk.encodeObj(
                    JSON.stringify({
                        system: noteString,
                        date: `${new Date()}`,
                    })
                );

                console.log(`Sending ${amount_bigInt} ${token.name} from ${routing.from_address} to ${routing.to_address}`);

                let txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    suggestedParams: params,
                    type: "axfer",
                    assetIndex: Number(assetID),
                    from: routing.from_address,
                    to: routing.to_address,
                    amount: Number(amount_bigInt),
                    note: note,
                    closeRemainderTo: undefined,
                    revocationTarget: undefined,
                    rekeyTo: undefined,
                });

                //console.log(JSON.stringify(txn));

                // if (!txn.Accounts.includes(routing.from_address)) txn.Accounts.push(routing.from_address);
                // if (!txn.Accounts.includes(routing.to_address)) txn.Accounts.push(routing.to_address);

                resolve(txn);

            } catch (error) {
                reject(error);
            }
        });

    }
    static async optinTransaction(client: Algodv2,
        address: string,
        token_asset_id: number): Promise<Transaction> {
        return new Promise(async (resolve, reject) => {
            try {
                //Get Default Transaction Params
                const suggestedParams = await client.getTransactionParams().do();

                //Setup Transaction
                const transactionOptions = {
                    from: address,
                    assetIndex: token_asset_id,
                    to: address,
                    amount: 0,
                    note: undefined,
                    closeRemainderTo: undefined,
                    revocationTarget: undefined,
                    rekeyTo: undefined,
                    suggestedParams,
                };
                const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions)
                resolve(txn);
            } catch (error) {
                reject(error);
            }
        });

    }

    //Txn Actions
    static async sendAlgo(client: Algodv2,
        routing: RoutingData,
        signer: Account,
        logger: Logger,
        debug_rootPath?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                var transactions: Transaction[] = [];
                transactions.push(await this.algoSendTransaction(client, routing));

                //Get Signer
                //let signer = deployer.accounts?.account(routing.from_address);
                if (!signer) throw new Error("Signer is required");

                let result = await this.signAndSend_SingleSigner(transactions, client, [signer], logger, debug_rootPath)

                resolve(true);

            } catch (error) {
                reject(error);
            }
        });

    }
    static async sendTokens(client: Algodv2,
        routing: RoutingData,
        signer: Account,
        token: TokenInfo,
        logger: Logger,
        debug_rootPath?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                logger.log(`Sending ${routing.amount} ${token.name} from ${routing.from_address} to ${routing.to_address}`);

                var transactions: Transaction[] = [];
                transactions.push(await this.tokenSendTransaction(client, routing, token));

                //Get Signer
                //let signer = deployer.accounts?.account(routing.from_address);
                if (!signer) throw new Error("Signer is required");

                let result = await this.signAndSend_SingleSigner(transactions, client, [signer], logger, debug_rootPath)
                logger.log(`Txn Completed`);
                resolve(true);

            } catch (error) {
                reject(error);
            }
        });

    }
    static async mintTokens(client: Algodv2,
        signers: Account[],
        msigParams: any,
        routing: RoutingData,
        token: TokenInfo,
        logger: Logger,
        debug_rootPath?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                logger.log(`Minting ${routing.amount} ${token.name} to ${routing.to_address}`);

                
                //Set From Address
                //routing.from_address = accounts.asaVaultMSigAddress;

                var transactions: Transaction[] = [];
                transactions.push(await this.tokenSendTransaction(client, routing, token));
                var result = await this.signAndSend_MultiSig(transactions, client, signers, msigParams, logger, debug_rootPath);
                logger.log("Minting Completed")
                resolve(true);

            } catch (error) {
                reject(error);
            }
        });

    }
    static async optinToken(client: Algodv2,
        signer: Account,
        routing: RoutingData,
        token: TokenInfo,
        logger: Logger): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                logger.log(`Opting in ${routing.to_address} to ${token.asset_id}`);

                //Get Signer                
                if (!token.asset_id) throw new Error("asset_id is required");

                var transactions: Transaction[] = [];
                let txn = await this.optinTransaction(client, routing.from_address, token.asset_id);
                transactions.push(txn);

                // //Get Signer
                // let signer = accounts?.account(routing.from_address);
                // if (!signer) throw new Error("Signer is required");

                //Send Txn
                var result = await this.signAndSend_SingleSigner(transactions, client, [signer], logger);
                logger.log(`Optin Completed`);
                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    }

    //Txn Helpers
    static async signAndSend_SingleSigner(groupedTxns: Transaction[],
        client: Algodv2,
        signers: Account[],
        logger: Logger,
        debug_rootPath?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                //Check signers
                if (signers.length == 0) throw new Error("No Signers");
                signers.forEach((signer) => {
                    if (!signer) throw new Error("Signer not defined");
                    if (!signer.sk) throw new Error("Signer Secret Key is required");
                });

                //Check Txns
                if (groupedTxns.length == 0) throw new Error("No Transactions to sign");
                if (groupedTxns.length > 4) throw new Error("Maximum 4 Transactions in a group");

                let signedTxns: Uint8Array[] = [];
                const groupID = algosdk.computeGroupID(groupedTxns);

                for (let i = 0; i < groupedTxns.length; i++) {
                    groupedTxns[i].group = groupID;
                    let signedTxn: Uint8Array = groupedTxns[i].signTxn(signers[0].sk);
                    signedTxns.push(signedTxn);
                }

                if (debug_rootPath) {
                    await this.createDryrun(client, signedTxns, debug_rootPath);
                }

                //Prep and Send Transactions
                logger.log('------------------------------')
                let txnResult = await client.sendRawTransaction(signedTxns).do();
                const confirmedTxn = await algosdk.waitForConfirmation(client, groupedTxns[0].txID().toString(), 4);
                logger.log('------------------------------')
                logger.log('Group Transaction ID: ' + txnResult.txId);
                for (let i = 0; i < groupedTxns.length; i++) {
                    let txnID = groupedTxns[i].txID().toString();
                    logger.log('Transaction ' + i + ': ' + txnID);
                }
                logger.log('------------------------------')
                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    }
    static async signAndSend_MultiSig(groupedTxns: Transaction[],
        client: Algodv2,
        signers: Account[],
        mParams: any,
        logger: Logger,
        debug_rootPath?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                //Check signers
                if (signers.length == 0) throw new Error("No Signers");
                signers.forEach((signer) => {
                    if (!signer) throw new Error("Signer not defined");
                    if (!signer.sk) throw new Error("Signer Secret Key is required");
                });

                //Check Txns
                if (groupedTxns.length == 0) throw new Error("No Transactions to sign");
                if (groupedTxns.length > 4) throw new Error("Maximum 4 Transactions in a group");

                let signedTxns: Uint8Array[] = [];
                const groupID = algosdk.computeGroupID(groupedTxns);

                for (let i = 0; i < groupedTxns.length; i++) {
                    groupedTxns[i].group = groupID;

                    let signedTxn: Uint8Array = algosdk.signMultisigTransaction(groupedTxns[i], mParams, signers[0].sk).blob;
                    for (let j = 1; j < signers.length; j++) {
                        signedTxn = algosdk.appendSignMultisigTransaction(signedTxn, mParams, signers[j].sk).blob
                    }
                    signedTxns.push(signedTxn);
                }

                if (debug_rootPath) {
                    logger.log(`Creating Dryrun at ${debug_rootPath}`);
                    await this.createDryrun(client, signedTxns, debug_rootPath);
                }

                //Prep and Send Transactions
                logger.log('------------------------------')
                let txnResult = await client.sendRawTransaction(signedTxns).do();
                const confirmedTxn = await algosdk.waitForConfirmation(client, groupedTxns[0].txID().toString(), 4);
                logger.log('------------------------------')
                logger.log('Group Transaction ID: ' + txnResult.txId);
                for (let i = 0; i < groupedTxns.length; i++) {
                    let txnID = groupedTxns[i].txID().toString();
                    logger.log('Transaction ' + i + ': ' + txnID);
                }
                logger.log('------------------------------')
                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    }
    
    static async createDryrun(client: Algodv2, rawSignedTxnBuff: Uint8Array[], rootPath?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {

                //Make sure root path is defined
                if (!rootPath) resolve(false);

                let fs = require('fs')
                var dryRun = null;

                let txnsDecoded = rawSignedTxnBuff.map((txn) => {
                    return algosdk.decodeSignedTransaction(txn);
                });

                dryRun = await algosdk.createDryrun({
                    client: client,
                    txns: txnsDecoded,
                });

                console.log(rootPath + '/tests/debug/algodebug.msgp');
                await fs.writeFile(rootPath + '/tests/debug/algodebug.msgp', algosdk.encodeObj(dryRun.get_obj_for_encoding(true)), (error: NodeJS.ErrnoException | null) => {
                    if (error) throw error;
                })

                resolve(true);

            } catch (error) {
                console.log(error);
                resolve(false);
            }
        });
    }
}