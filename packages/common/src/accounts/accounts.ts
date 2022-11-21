import * as fs from 'fs'

export type AccountConfig = {
    bridge_accounts: AccountInfo[];
    local_accounts: AccountInfo[];
    bridge_msigs: BridgeMSigInfo[];
    local_msigs: BridgeMSigInfo[];
    loaded: boolean;
}
export type AccountInfo = {
    network: string;
    name: string;
    address: string;
}
export type BridgeMSigInfo = {
    network: string;
    name: string;
    address: string;
    signers: string[];
}
export enum BridgeAccountNames {
    algorand_asaOwner = "algorand_asaOwner",
    algorand_algoOwner = "algorand_algoOwner",
    algorand_bridgeOwner = "algorand_bridgeOwner",
    algorand_feeReceiver = "algorand_feeReceiver",
    algorand_multisig1 = "algorand_multisig1",
    algorand_multisig2 = "algorand_multisig2",
    algorand__bridge = "algorand__bridge",
    algorand_asaVault = "algorand_asaVault",
    algorand_algoVault = "algorand_algoVault"
}

export class BridgeAccounts {

    public static config: AccountConfig = {
        bridge_accounts: [],
        local_accounts: [],
        bridge_msigs: [],
        local_msigs: [],
        loaded: false
    };

    //Load/Save Config
    public static loadConfig(path: string) {
        const configString = fs.readFileSync(path, 'utf8');
        BridgeAccounts.config = JSON.parse(configString) as AccountConfig;
    }
    public static saveConfig(path: string) {
        const writeValue = JSON.stringify(BridgeAccounts.config, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, 2);

        fs.writeFileSync(path, writeValue);
    }

    //Get Account Info
    public static getAddress(name: BridgeAccountNames): string {
        const network = name.split("_")[0];
        const accountName = name.split("_")[1];
        const info = BridgeAccounts.getAccountInfo(network, accountName);
        if (info === undefined) {
            //Check msig
            const msigInfo = BridgeAccounts.getMSigInfo(network, accountName);
            if (msigInfo === undefined) {
                throw new Error("Account not found: " + name);
            } else {
                return msigInfo.address;
            }
        } else {
            return info.address;
        }
    }
    public static getAccountInfo(network: string, name: string): AccountInfo | undefined {
        console.log(`matching: ${name.toLowerCase()} ${network.toLowerCase()}`);

        const accounts = BridgeAccounts.config.bridge_accounts;
        accounts.push(...BridgeAccounts.config.local_accounts);
        for (let i = 0; i < accounts.length; i++) {
            const info = accounts[i];
            if (info.network.toLowerCase() === network.toLowerCase() &&
                info.name.toLowerCase() === name.toLowerCase()) return info;
        }

        return undefined;
    }
    public static getMSigInfo(network: string, name: string): BridgeMSigInfo | undefined {
        console.log(`matching: ${name.toLowerCase()} ${network.toLowerCase()}`);

        const accounts = BridgeAccounts.config.bridge_msigs;
        accounts.push(...BridgeAccounts.config.local_msigs);
        for (let i = 0; i < accounts.length; i++) {
            const info = accounts[i];
            if (info.network.toLowerCase() === network.toLowerCase() &&
                info.name.toLowerCase() === name.toLowerCase()) return info;
        }

        return undefined;
    }

}