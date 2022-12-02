import { AlgorandConfig } from "glitter-bridge-algorand";
import { BridgeAccountConfig, BridgeTokenConfig } from "glitter-bridge-common";
import { SolanaConfig } from "glitter-bridge-solana";

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