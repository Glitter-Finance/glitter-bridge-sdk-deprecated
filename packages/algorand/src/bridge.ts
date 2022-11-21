import algosdk, { Transaction } from "algosdk";
import { RoutingData } from "glitter-bridge-common/lib/routing";
import { TokenInfo } from "glitter-bridge-common/lib/tokens";
import { BridgeAccountNames, BridgeAccounts } from "glitter-bridge-common/lib/accounts/accounts";

export enum AlgorandBridgeTxnType {
    none,
    token_vault_setup = "token_vault_setup",
    token_vault_update_fee = "token_vault_update_fee",
    token_vault_update_limits = "token_vault_update_limits",
    token_vault_deposit = "token_vault_deposit",
    token_vault_release = "token_vault_release",
    token_vault_refund = "token_vault_refund",
    token_vault_optin = "token_vault_optin",
    xsol_release = "xSOL-release",
    algo_release = "algo-release",
    xsol_deposit = "xSOL-deposit",
    algo_deposit = "algo-deposit",
    xsol_refund = "xSOL-refund",
    algo_refund = "algo-refund"
}

export class AlgorandBridge {

    private static _bridgeApprovalAppId = 0;

    public constructor(bridgeApprovalAppId: number) {
        AlgorandBridge._bridgeApprovalAppId = bridgeApprovalAppId;
    }

    public static appArgs(functionName: AlgorandBridgeTxnType): Uint8Array[] | undefined;
    public static appArgs(functionName: AlgorandBridgeTxnType, routing: RoutingData): Uint8Array[] | undefined;
    public static appArgs(functionName: AlgorandBridgeTxnType, routing: RoutingData, token: TokenInfo): Uint8Array[] | undefined;
    public static appArgs(functionName: AlgorandBridgeTxnType, routing?: RoutingData, token?: TokenInfo): Uint8Array[] | undefined {

        const appArgs: Uint8Array[] = [];
        let solana_asset = "";
        let app_asset_type = "";

        switch (functionName) {
            case AlgorandBridgeTxnType.token_vault_setup:
            case AlgorandBridgeTxnType.token_vault_update_fee:
            case AlgorandBridgeTxnType.token_vault_update_limits:
            case AlgorandBridgeTxnType.token_vault_optin:

                //Fail Safe
                if (!token) throw new Error("Token Config is required");
                {
                    appArgs.push(new Uint8Array(Buffer.from(AlgorandBridgeTxnType[functionName]))); //0
                    appArgs.push(algosdk.encodeUint64(Number(token.asset_id)));  //1
                    appArgs.push(new Uint8Array(Buffer.from(token.symbol)));  //2
                    appArgs.push(algosdk.encodeUint64(Number(token.decimals)));  //3
                    appArgs.push(algosdk.encodeUint64(Number(token.fee_divisor)));  //4

                    const min_transfer = token.min_transfer ? token.min_transfer : 0;
                    appArgs.push(algosdk.encodeUint64(Number(min_transfer * Math.pow(10, token.decimals))));  //5
                    const max_transfer = token.max_transfer ? token.max_transfer : 0;
                    appArgs.push(algosdk.encodeUint64(Number(max_transfer * Math.pow(10, token.decimals))));  //6
                }
                break;

            case AlgorandBridgeTxnType.xsol_deposit:
            case AlgorandBridgeTxnType.algo_deposit:

                //Fail Safe
                if (!routing) throw new Error("Bridge Transaction is required");
                if (routing.to_network.toLowerCase() != "solana") throw new Error("to network is not solana");
                if (routing.from_address.toLowerCase() != "algorand") throw new Error("from network is not algorand");

                //Get Integer Amount
                {
                    if (!token) throw new Error("Token Config is required");
                    const integerValue = routing.amount * Math.pow(10, token.decimals);

                    //Set Solana Asset
                    if (functionName == AlgorandBridgeTxnType.xsol_deposit) {
                        solana_asset = "sol";
                        app_asset_type = "xSOL";
                    } else if (functionName == AlgorandBridgeTxnType.algo_deposit) {
                        solana_asset = "xALGoH1zUfRmpCriy94qbfoMXHtK6NDnMKzT4Xdvgms";
                        app_asset_type = "algo";
                    }

                    appArgs.push(new Uint8Array(Buffer.from(routing.to_address))); //0 (Solana Address)
                    appArgs.push(new Uint8Array(Buffer.from(routing.from_address))); //1 (Algorand Address)
                    appArgs.push(new Uint8Array(Buffer.from(solana_asset))); //2 (Solana Asset)
                    appArgs.push(new Uint8Array(Buffer.from(app_asset_type))); //3 (Algorand Asset)
                    appArgs.push(new Uint8Array(Buffer.from(functionName.toString()))); //4 (App Call)
                    appArgs.push(new Uint8Array(Buffer.from(routing.to_txn_signature))); //5 (Solana Signature)
                    appArgs.push(algosdk.encodeUint64(Number(integerValue))); //6 (Amount)
                }
                break;

            case AlgorandBridgeTxnType.xsol_release:
            case AlgorandBridgeTxnType.algo_release:
            case AlgorandBridgeTxnType.xsol_refund:
            case AlgorandBridgeTxnType.algo_refund:

                //Fail Safe
                if (!routing) throw new Error("Bridge Transaction is required");
                if (routing.from_network.toLowerCase() != "solana") throw new Error("from network is not solana");
                if (routing.to_network.toLowerCase() != "algorand") throw new Error("to network is not algorand");

                //Get Integer Amount
                if (!token) throw new Error("Token Config is required");
                {
                    const integerValue = routing.amount * Math.pow(10, token.decimals);

                    //Set Solana Asset
                    if (functionName == AlgorandBridgeTxnType.xsol_release ||
                        functionName == AlgorandBridgeTxnType.xsol_refund) {
                        solana_asset = "sol";
                        app_asset_type = "xSOL";
                    } else if (functionName == AlgorandBridgeTxnType.algo_release ||
                        functionName == AlgorandBridgeTxnType.algo_refund) {
                        solana_asset = "xALGoH1zUfRmpCriy94qbfoMXHtK6NDnMKzT4Xdvgms";
                        app_asset_type = "algo";
                    }

                    appArgs.push(new Uint8Array(Buffer.from(routing.from_address))); //0 (Solana Address)
                    appArgs.push(new Uint8Array(Buffer.from(routing.to_address))); //1 (Algorand Address)
                    appArgs.push(new Uint8Array(Buffer.from(solana_asset))); //2 (Solana Asset)
                    appArgs.push(new Uint8Array(Buffer.from(app_asset_type))); //3 (Algorand Asset)
                    appArgs.push(new Uint8Array(Buffer.from(functionName.toString()))); //4 (App Call)
                    appArgs.push(new Uint8Array(Buffer.from(routing.to_txn_signature))); //5 (Solana Signature)
                    appArgs.push(algosdk.encodeUint64(Number(integerValue))); //6 (Amount)
                }
                break;

            case AlgorandBridgeTxnType.token_vault_deposit:
            case AlgorandBridgeTxnType.token_vault_release:
            case AlgorandBridgeTxnType.token_vault_refund:

                //Fail Safe
                if (!routing) throw new Error("Bridge Transaction is required");
                if (!token) throw new Error("Token Config is required");

                {
                    //Get Integer Amount
                    const integerValue = routing.amount * Math.pow(10, token.decimals);

                    let from_signature = "null";
                    if (routing.from_txn_signature) from_signature = routing.from_txn_signature;

                    //console.log(JSON.stringify(routing));
                    let from_pk: Uint8Array = new Uint8Array();
                    if (routing.from_address && routing.from_network.toLocaleLowerCase() === "algorand") from_pk = algosdk.decodeAddress(routing.from_address).publicKey;
                    let to_pk: Uint8Array = new Uint8Array();
                    if (routing.to_address && routing.to_network.toLocaleLowerCase() === "algorand") to_pk = algosdk.decodeAddress(routing.to_address).publicKey;

                    appArgs.push(new Uint8Array(Buffer.from(AlgorandBridgeTxnType[functionName]))); //0
                    appArgs.push(new Uint8Array(Buffer.from(routing.from_network))); //1
                    appArgs.push(new Uint8Array(Buffer.from(routing.from_address))); //2
                    appArgs.push(from_pk); //3
                    appArgs.push(new Uint8Array(Buffer.from(from_signature))); //4
                    appArgs.push(new Uint8Array(Buffer.from(routing.to_network))); //5
                    appArgs.push(new Uint8Array(Buffer.from(routing.to_address))); //6
                    appArgs.push(to_pk); //7
                    appArgs.push(algosdk.encodeUint64(Number(integerValue))); //8
                }

                break;

            default:
                return undefined;
        }

        return appArgs;


    }

    public static async BridgeApprovalTransaction(
        client: algosdk.Algodv2,
        functionName: AlgorandBridgeTxnType,
        routing: RoutingData,
    ): Promise<Transaction> {

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                //Get Default Parameters
                const params = await client.getTransactionParams().do();
                params.fee = 1000;
                params.flatFee = true;

                //Encode Note
                const record = {
                    routing: JSON.stringify(routing),
                    date: `${new Date()}`,
                }
                const note = algosdk.encodeObj(
                    record
                );

                //Get app args 
                const appArgs = this.appArgs(functionName, routing) as Uint8Array[];

                //get accounts
                const accounts: string[] = [];
                switch (functionName) {
                    case AlgorandBridgeTxnType.xsol_deposit:
                        accounts.push(routing.from_address);
                        accounts.push(BridgeAccounts.getAddress(BridgeAccountNames.algorand_asaVault));
                        break;
                    case AlgorandBridgeTxnType.algo_deposit:
                        accounts.push(routing.from_address);
                        accounts.push(BridgeAccounts.getAddress(BridgeAccountNames.algorand_algoVault));
                        break;
                    default:
                        accounts.push(routing.from_address);
                        break;
                }

                //Get Bridge 
                const txn = algosdk.makeApplicationNoOpTxnFromObject({
                    note: note,
                    suggestedParams: params,
                    from: routing.from_address,
                    accounts: accounts,
                    appIndex: AlgorandBridge._bridgeApprovalAppId,
                    appArgs: appArgs,
                    rekeyTo: undefined,
                });
                resolve(txn);

            } catch (error) {
                reject(error);
            }
        });

    }
}