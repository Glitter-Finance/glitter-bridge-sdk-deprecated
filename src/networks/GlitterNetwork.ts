import { AlgorandConfig } from "glitter-bridge-algorand/lib/config";
import { SolanaConfig } from "glitter-bridge-solana/lib/config";

export enum Networks {
    mainnet = "mainnet",
    testnet = "testnet",
}

export type GlitterNetwork = {
    network: Networks;
    algorand: AlgorandConfig;
    solana: SolanaConfig;
}