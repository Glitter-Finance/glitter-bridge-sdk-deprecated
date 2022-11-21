import algosdk, { Algodv2, MultisigMetadata } from "algosdk";
import { TokenInfo } from "glitter-bridge-common/lib/tokens";
import { Logger } from "glitter-bridge-common/lib/Utils/logger";

export type AlgorandAccount = {
    addr: string;
    sk: Uint8Array;
}
export type AlgorandMSigAccount = {
    addr: string;
    addresses: string[];
    params:MultisigMetadata 
}

export class AlgorandAccounts {

    private static _accounts: Record<string, AlgorandAccount> = {};
    private static _msigs: Record<string, AlgorandMSigAccount> = {};

    public static add(sk: string|undefined, logger: Logger | undefined): AlgorandAccount|undefined {

        //Fail Safe
        if (!sk) {
            logger?.error("sk not defined");
            return undefined;
        }

        //Convert seed to Account
        const local_acccount = algosdk.mnemonicToSecretKey(sk) as AlgorandAccount;
        if (!local_acccount){
            logger?.error("sk not valid");
            return undefined;
        }

        //Add to accounts
        this._accounts[local_acccount.addr] = local_acccount;

        //Log
        logger?.log(`Added Algorand Wallet:  ${local_acccount.addr}`)

        //return
        return local_acccount;
    }
    public static addMSIG(addreses:string[],version = 1,threshold=2 ){

        const params = {
            version: version,
            threshold: threshold,
            addrs: addreses
        } as MultisigMetadata;

        const addr = algosdk.multisigAddress(params);

        const msig:AlgorandMSigAccount = {
            addr: addr,
            addresses: addreses,
            params: params
        };

        this._msigs[addreses.join(",")] = msig;

        return msig;

    }
    public static get(addr: string): AlgorandAccount | undefined {
        return this._accounts[addr];
    }
    public static getMSIG(addreses:string[]): AlgorandMSigAccount | undefined {
        return this._msigs[addreses.join(",")];
    }

    //Account Query
    static async getTokensHeld(client: Algodv2, address: string, token: TokenInfo): Promise<number> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {

                //Fail Safe
                if (!token) throw new Error("Token not defined");
                if (!address) throw new Error("Address not defined");

                const accountInfo = await client.accountInformation(address).do();
                if (!accountInfo) throw new Error("Account Info not found");

                let tokensHeld = 0;
                for (let i = 0; i < accountInfo.assets.length; i++) {
                    if (accountInfo.assets[i]['asset-id'] == token.asset_id) {
                        tokensHeld = accountInfo.assets[i].amount;
                    }
                }
                resolve(tokensHeld);
            } catch (error) {
                reject(error);
            }
        });

    }
}