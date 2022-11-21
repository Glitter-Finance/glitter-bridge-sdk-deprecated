export type SolanaConfig = {
    name: string;
    server: string;
    seed: string;
    bridge_program_id: string;
    vesting_program_id: string;
    owner_address: string;
    assets_info: SolanaAssetConfig[];
  };  
  export type SolanaAssetConfig = {
    symbol: string;
    type: string;
    mint: string;
    decimal: number;
    min_balance: number;
    fee_rate: number;
  };