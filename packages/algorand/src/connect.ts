import algosdk from "algosdk";
import { AlgorandConfig } from "./config";

/**
 * Connection to the Algorand network
 * 
 */
export class AlgorandConnect {

    private _algoClientIndexer: algosdk.Indexer | undefined = undefined;
    private _algoClient: algosdk.Algodv2 | undefined = undefined;

    constructor(config: AlgorandConfig) {
        this._algoClient = GetAlgodClient(config.serverUrl, config.serverPort, config.nativeToken);
        this._algoClientIndexer = GetAlgodIndexer(config.indexerUrl, config.indexerUrl, config.nativeToken);
    }

    public get algoClient() {
        return this._algoClient;
    }
    public get algoClientIndexer() {
        return this._algoClientIndexer;
    }

}

export const GetAlgodIndexer = (url: string, port: string | number, token = ''): algosdk.Indexer => {
    // const server = config.algo_client;
    // const port   = config.algo_port;
    const indexer = new algosdk.Indexer(token, url, port);
    indexer.setIntEncoding(algosdk.IntDecoding.MIXED);
    return indexer;
};

export const GetAlgodClient = (url: string, port: string | number, token: string): algosdk.Algodv2 => {
    const client = new algosdk.Algodv2(token, url, port);
    client.setIntEncoding(algosdk.IntDecoding.MIXED);
    return client;
};
