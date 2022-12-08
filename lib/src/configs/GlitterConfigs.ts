import { AlgorandConfig } from "glitter-bridge-algorand-dev";
import { BridgeAccountConfig, BridgeTokenConfig } from "glitter-bridge-common-dev";
import { SolanaConfig } from "glitter-bridge-solana-dev";

import * as GlitterConfigs1 from './mainnet.settings.json';
import * as GlitterConfigs2 from './testnet.settings.json';

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