import { Connection } from '@solana/web3.js';

export class SolanaConnect{

    private _solClient: Connection | undefined = undefined;

    /**
     * 
     * @param solanaUrl Defaults to https://api.mainnet-beta.solana.com
     */
    constructor(solanaUrl = 'https://api.mainnet-beta.solana.com') {
        this._solClient = new Connection(solanaUrl);
    }

    public get solClient() {
        return this._solClient;
    }

}