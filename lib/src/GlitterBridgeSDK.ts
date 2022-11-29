import * as fs from 'fs'
import { AlgorandConnect } from 'glitter-bridge-algorand-dev';
import { SolanaConnect } from 'glitter-bridge-solana-dev';
import * as path from 'path';
import * as util from "util";
import { GlitterConfigs, Networks } from './configs/GlitterConfigs';
import { BridgeAccounts, BridgeTokens } from 'glitter-bridge-common-dev';

export enum Environment {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export enum BridgeNetworks {
  algorand = "Algorand",
  solana = "Solana"
}

export default class GlitterBridgeSdk {

  //Directory
  private _rootDirectory: string | undefined;

  //Configs
  private _glitterNetwork: GlitterConfigs | undefined;

  //Connections
  private _algorand: AlgorandConnect | undefined;
  private _solana: SolanaConnect | undefined;

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
        configUrl = path.join(this._rootDirectory, `./lib/src/configs/${network.toString()}.settings.json`);
        break;
    }

    //Read the config file
    const configString = fs.readFileSync(configUrl, 'utf8');
    this._glitterNetwork = JSON.parse(configString) as GlitterConfigs;

    console.log(util.inspect(this._glitterNetwork, false, 5, true /* enable colors */));

    BridgeAccounts.loadConfig(this._glitterNetwork.accounts);
    BridgeTokens.loadConfig(this._glitterNetwork.tokens);


    return this;
  }

  //Connectors
  public connect(networks: BridgeNetworks[]): GlitterBridgeSdk {

    //Connect to the networks
    networks.forEach(network => {
      switch (network) {
        case BridgeNetworks.algorand:
          this.connectToAlgorand();
          break;
        case BridgeNetworks.solana:
          this.connectToSolana();
          break;
      }
    });

    return this;
  }
  private connectToAlgorand(): GlitterBridgeSdk {

    //Failsafe
    if (!this._glitterNetwork) throw new Error("Glitter environment not set");
    if (!this._glitterNetwork.algorand) throw new Error("Algorand environment not set");

    //Get the connections
    this._algorand = new AlgorandConnect(this._glitterNetwork.algorand);

    if (!this._algorand.client) throw new Error("Algorand client not set");

    return this;
  }
  private connectToSolana(): GlitterBridgeSdk {
    //Failsafe
    if (!this._glitterNetwork) throw new Error("Glitter environment not set");
    if (!this._glitterNetwork.solana) throw new Error("Solana environment not set");

    this._solana = new SolanaConnect(this._glitterNetwork?.solana);
    //(this._glitterNetwork.algorand.appProgramId);

    if (!this._solana.client) throw new Error("Solana client not set");
    return this;
  }

  //Getters  
  get algorand(): AlgorandConnect | undefined {
    return this._algorand;
  }
  get solana(): SolanaConnect | undefined {
    return this._solana;
  }

}