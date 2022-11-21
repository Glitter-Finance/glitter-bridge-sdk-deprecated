import algosdk from "algosdk";

/**
 * Connection to the Algorand network
 * 
 */
export class AlgorandConnect {

    private _algoClientIndexer: algosdk.Indexer | undefined = undefined;
    private _algoClient: algosdk.Algodv2 | undefined = undefined;
   
    /**
     * 
     * @param algoServerUrl Defaults to 'https://node.algoexplorerapi.io'
     * @param algoServerPort Defaults to ""
     * @param algoIndexerUrl Defaults to 'https://algoindexer.algoexplorerapi.io'
     * @param algoIndexerPort Defaults to ""
     * @param algoNativeToken Defaults to ""
     */
    constructor(
        algoServerUrl = 'https://node.algoexplorerapi.io',
        algoServerPort: string | number= "",
        algoIndexerUrl= 'https://algoindexer.algoexplorerapi.io',
        algoIndexerPort: string | number= "",
        algoNativeToken= ""
    ) {
        this._algoClient = GetAlgodClient(algoServerUrl, algoServerPort, algoNativeToken);
        this._algoClientIndexer = GetAlgodIndexer(algoIndexerUrl, algoIndexerPort, algoNativeToken);        
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
