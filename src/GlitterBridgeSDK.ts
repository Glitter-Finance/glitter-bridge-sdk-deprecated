//import config, { Network } from './config/config';

import { AlgorandConnect } from 'glitter-bridge-algorand/lib/connect';
import { AlgorandBridge } from 'glitter-bridge-algorand/lib/bridge';
import { SolanaConnect } from 'glitter-bridge-solana/lib/connect';
import { AlgorandConfig } from 'glitter-bridge-algorand/lib/config';

// import { AlgoBlockchainClient } from './Algorand/AlgoBlockchainClient';
// import { SolanaBlockchainClient } from './Solana/SolanaBlockchainClient';

export enum Environment {
  testnet,
  mainnet,
}

export default class GlitterBridgeSdk {

  // private _config: Network = {
  //   Algorand: config.algorand.mainnet,
  //   Solana: config.solana.mainnet
  // };

  //Bridge
  private _algorandBridge: AlgorandBridge | undefined;

  //Connections
  private _algorandConnection: AlgorandConnect | undefined;
  private _solanaConnection: SolanaConnect | undefined;

  //Setters
  // public setConfig(env: Environment) {
  //   if (env == Environment.testnet) {
  //     this._config = { Algorand: config.algorand.testnet, Solana: config.solana.testnet };
  //   }
  //   return this;
  // }

  /**
     * 
     * @param algoServerUrl Defaults to 'https://node.algoexplorerapi.io'
     * @param algoServerPort Defaults to ""
     * @param algoIndexerUrl Defaults to 'https://algoindexer.algoexplorerapi.io'
     * @param algoIndexerPort Defaults to ""
     * @param algoNativeToken Defaults to ""
     */
  public connectToAlgorand(config: AlgorandConfig): GlitterBridgeSdk {
    this._algorandConnection = new AlgorandConnect(config);
    this._algorandBridge = new AlgorandBridge( config);
    return this;
  }
  public connectToSolana(
    solanaUrl = 'https://api.mainnet-beta.solana.com'
  ): GlitterBridgeSdk {
    this._solanaConnection = new SolanaConnect(solanaUrl);
    return this;
  }

  //Getters  
  get algoClient() {
    if (!this._algorandConnection) throw new Error("Algorand connection not set");
    const client = this._algorandConnection.algoClient;
    if (!client) throw new Error("Algorand client not set");
    return client;
  }
  get algoIndexer() {
    if (!this._algorandConnection) throw new Error("Algorand connection not set");
    const indexer = this._algorandConnection.algoClientIndexer;
    if (!indexer) throw new Error("Algorand indexer not set");
    return indexer;
  }

  get solClient() {
    if (!this._solanaConnection) throw new Error("Solana connection not set");
    const client = this._solanaConnection.solClient;
    if (!client) throw new Error("Solana client not set");
    return client;
  }
}