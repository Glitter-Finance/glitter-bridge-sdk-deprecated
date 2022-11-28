import { AlgorandConfig } from "glitter-bridge-algorand/lib/config";
import { SolanaConfig } from "glitter-bridge-solana/lib/config";
import {BridgeAccountConfig} from "glitter-bridge-common/lib/accounts/accounts";
import {BridgeTokenConfig} from "glitter-bridge-common/lib/tokens";

export enum Networks {
    mainnet = "mainnet",
    testnet = "testnet",
}

export type GlitterConfigs = {
    name: string;
    algorand: AlgorandConfig;
    solana: SolanaConfig;
    accounts: BridgeAccountConfig,
    tokens:BridgeTokenConfig  
}