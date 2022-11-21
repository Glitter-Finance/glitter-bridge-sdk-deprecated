//import config, { Network } from './config/config';

import { AlgorandConnect } from 'glitter-bridge-algorand/lib/connect';
import { AlgorandBridge } from 'glitter-bridge-algorand/lib/bridge';
import { SolanaConnect } from 'glitter-bridge-solana/lib/connect';
import { AlgorandConfig } from 'glitter-bridge-algorand/lib/config';
import * as fs from 'fs'
import path from 'path';
import { GlitterNetwork, Networks } from './networks/GlitterNetwork';

// import { AlgoBlockchainClient } from './Algorand/AlgoBlockchainClient';
// import { SolanaBlockchainClient } from './Solana/SolanaBlockchainClient';

export enum Environment {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export default class GlitterBridgeSdk {

  //Directory
  private _rootDirectory: string|undefined;

  //Configs
  private _glitterEnvironment: GlitterNetwork|undefined;
  private _algorandConfig: AlgorandConfig | undefined;

  //Bridge
  private _algorandBridge: AlgorandBridge | undefined;

  //Connections
  private _algorandConnection: AlgorandConnect | undefined;
  private _solanaConnection: SolanaConnect | undefined;

  //Setters
  public setRootDirectory(rootDirectory: string): GlitterBridgeSdk {
    this._rootDirectory = rootDirectory;
    return this;
  }
  public setEnvironment(network: Networks): GlitterBridgeSdk {

    //Fail safe
    if (!this._rootDirectory) throw new Error("Root directory not set");

    //Get the environment config path
    let configUrl = '';
    switch (network) {
      case Networks.mainnet:
      case Networks.testnet:
        configUrl = path.join(this._rootDirectory, `./src/networks/${Environment.mainnet}/${Environment.mainnet}.settings.json`);
        break;
    }

    //Read the config file
    const configString = fs.readFileSync(configUrl, 'utf8');
    this._glitterEnvironment = JSON.parse(configString) as GlitterNetwork;

    return this;
  }

  //Connectors
  public connectToAlgorand(): GlitterBridgeSdk {

    //Failsafe
    if (!this._glitterEnvironment) throw new Error("Glitter environment not set");
    if (!this._glitterEnvironment.algorand) throw new Error("Algorand environment not set");

    //Get the connections
    this._algorandConnection = new AlgorandConnect(this._glitterEnvironment.algorand);
    this._algorandBridge = new AlgorandBridge(this._glitterEnvironment.algorand.appProgramId);
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