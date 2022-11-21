import { AlgorandConfig } from "glitter-bridge-algorand/lib/config";
import { SolanaConfig } from "glitter-bridge-solana/lib/config";

export enum Environments {
    mainnet,
    testnet
}

export type GlitterEnvironment = {
    environment: Environments;
    algorand: AlgorandConfig;
    solana: SolanaConfig;
}