import * as fs from 'fs'
import { AlgorandConnect } from 'glitter-bridge-algorand-dev';
import { SolanaConnect } from 'glitter-bridge-solana-dev';
import * as path from 'path';
import * as util from "util";
import { GlitterConfigs, GlitterNetworks } from './configs/GlitterConfigs';
import { BridgeAccounts, BridgeTokens } from 'glitter-bridge-common-dev';

export enum Environment {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export enum BridgeNetworks {
  algorand = "Algorand",
  solana = "Solana"
}

export class GlitterBridgeSDK {

  //Directory
  private _configDirectory: string | undefined;

  //Configs
  private _glitterNetwork: GlitterConfigs | undefined;
  
  //RPC overrides
  private _rpcOverrides: { [key: string]: string } = {};

  //Connections
  private _algorand: AlgorandConnect | undefined;
  private _solana: SolanaConnect | undefined;

  //Setters
  public setConfigDirectory(directory: string): GlitterBridgeSDK {
    this._configDirectory = directory;
    return this;
  }
  public setEnvironment(network: GlitterNetworks): GlitterBridgeSDK {

    //Fail safe
    if (!this._configDirectory) {
      this._configDirectory = path.join(__dirname, "./configs");
    }

    //Get the environment config path
    let configUrl = '';
    switch (network) {
      case GlitterNetworks.mainnet:
      case GlitterNetworks.testnet:
        configUrl = path.join(this._configDirectory, `./${network.toString()}.settings.json`);
        break;
    }

    //Read the config file
    const configString = fs.readFileSync(configUrl, 'utf8');
    this._glitterNetwork = JSON.parse(configString) as GlitterConfigs;
    //console.log(util.inspect(this._glitterNetwork, false, 5, true /* enable colors */));

    BridgeAccounts.loadConfig(this._glitterNetwork.accounts);
    BridgeTokens.loadConfig(this._glitterNetwork.tokens);

    return this;
  }
  public setRPC(network: BridgeNetworks, rpc: string): GlitterBridgeSDK {
    this._rpcOverrides[network] = rpc;
    return this;
  }

  //Connectors
  public connect(networks: BridgeNetworks[]): GlitterBridgeSDK {

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
  private connectToAlgorand(): GlitterBridgeSDK {

    //Failsafe
    if (!this._glitterNetwork) throw new Error("Glitter environment not set");
    if (!this._glitterNetwork.algorand) throw new Error("Algorand environment not set");

    if (this._rpcOverrides[BridgeNetworks.algorand]) {
      console.log("Algorand RPC override: " + this._rpcOverrides[BridgeNetworks.algorand]);
      this._glitterNetwork.algorand.serverUrl = this._rpcOverrides[BridgeNetworks.algorand];
    }

    //Get the connections
    this._algorand = new AlgorandConnect(this._glitterNetwork.algorand);

    if (!this._algorand.client) throw new Error("Algorand client not set");

    return this;
  }
  private connectToSolana(): GlitterBridgeSDK {
    //Failsafe
    if (!this._glitterNetwork) throw new Error("Glitter environment not set");
    if (!this._glitterNetwork.solana) throw new Error("Solana environment not set");

    if (this._rpcOverrides[BridgeNetworks.solana]) {
      console.log("Solana RPC override: " + this._rpcOverrides[BridgeNetworks.solana]);
      this._glitterNetwork.solana.server = this._rpcOverrides[BridgeNetworks.solana];
    }

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