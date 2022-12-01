import { AlgorandConfig } from "glitter-bridge-algorand-dev";
import { BridgeAccountConfig, BridgeTokenConfig } from "glitter-bridge-common-dev";
import { SolanaConfig } from "glitter-bridge-solana-dev";

export enum GlitterNetworks {
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