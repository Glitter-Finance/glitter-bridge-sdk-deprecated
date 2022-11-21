export type AlgorandConfig = {
    name: string;
    server?: string;
    serverPort?: string;
    indexer?: string;
    indexerPort?: string;
    nativeToken?: string;
    appProgramId?: number;
    bridgeOwnerAddress: string;
    asaVaultOwnerAddress: string;
    feeReceiverOwnerAddress: string;
    algoVaultOwnerAddress: string;
    mSig1Address: string;
    mSig2Address: string;
    assets_info: AlgorandAssetConfig[];
}

export type AlgorandAssetConfig = {
    symbol: string;
    type: string;
    asset_id: number;
    decimal: number;
    min_balance: number;
    fee_rate: number;
  };