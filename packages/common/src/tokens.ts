import * as fs from 'fs'
import * as minimist from 'minimist'

export enum TokenParams {
    none = 0,
    name = 1 << 1,
    symbol = 1 << 2,
    decimals = 1 << 3,
    total_supply = 1 << 4,
    min_transfer = 1 << 5,
    max_transfer = 1 << 6,
    fee_divisor = 1 << 7,
    all = name | symbol | decimals | total_supply | min_transfer | max_transfer | fee_divisor
}
export type TokenConfig = {
    approval_app: number;
    assets_info: TokenInfo[];
    loaded: boolean;
}
export type TokenInfo = {
    network: string;
    name: string;
    symbol: string;
    type: string;
    asset_id: number | undefined;
    bridge_vault_id: number | undefined;
    decimals: number;
    min_transfer: number | undefined;
    max_transfer: number | undefined;
    fee_divisor: number | undefined;
    total_supply: bigint;
    loaded: boolean;
}
export function initToken(options?: Partial<TokenInfo>): TokenInfo {
    const defaults = {
        network: "",
        name: "",
        symbol: "",
        type: "",
        asset_id: undefined,
        bridge_vault_id: undefined,
        decimals: 0,
        min_transfer: undefined,
        max_transfer: undefined,
        fee_divisor: undefined,
        total_supply: BigInt(0),
        loaded: false
    }
    return {
        ...defaults,
        ...options,
    };
}
export class BridgeTokens {

    public static config: TokenConfig = {
        approval_app: 0,
        assets_info: [],
        loaded: false
    };

    //Load/Save Config
    public static loadConfig(path: string) {
        const configString = fs.readFileSync(path, 'utf8');
        BridgeTokens.config = JSON.parse(configString) as TokenConfig;
    }
    public static saveConfig(path: string) {
        const writeValue = JSON.stringify(BridgeTokens.config, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, 2);
        
        fs.writeFileSync(path, writeValue);
    }

    //Get Token Info
    public static getTokenInfo(network: string, symbol: string): TokenInfo | undefined {
        console.log(`matching: ${symbol.toLowerCase()} ${network.toLowerCase()}`);

        const tokens = BridgeTokens.config.assets_info;
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.network.toLowerCase() === network.toLowerCase() &&
                token.symbol.toLowerCase() === symbol.toLowerCase()) return token;
        }
        return undefined;
    }

    public static loadFromCli(requiredParams?: TokenParams): TokenInfo | undefined {

        const token = initToken();
        try {

            //parse params
            const argv = minimist(process.argv.slice(2));

            token.name = argv.name;
            token.decimals = argv.d;
            token.symbol = argv.s;
            if (argv.network) token.network = argv.network.toLowerCase();
            token.min_transfer = argv.min;
            token.max_transfer = argv.max;
            token.fee_divisor = argv.fee;

            const totalSupply = argv.t as string;
            token.total_supply = (!totalSupply ? BigInt(0) : BigInt(totalSupply));

            //ensure params are set
            if (requiredParams) {
                if ((requiredParams & TokenParams.name) === TokenParams.name) {
                    if (!token.name && token.name === undefined) throw new Error("Token Name is required");
                }
                if ((requiredParams & TokenParams.symbol) === TokenParams.symbol) {
                    if (!token.symbol && token.symbol === undefined) throw new Error("Asset Symbol is required");
                }
                if ((requiredParams & TokenParams.decimals) === TokenParams.decimals) {
                    if (!token.decimals && token.decimals === undefined) throw new Error("Decimals is required");
                }
                if ((requiredParams & TokenParams.total_supply) === TokenParams.total_supply) {
                    if (!token.total_supply && token.total_supply === undefined) throw new Error("Total Supply is required");
                }

                if ((requiredParams & TokenParams.min_transfer) === TokenParams.min_transfer) {
                    if (!token.min_transfer) {
                        throw new Error('Minimum Transfer not specified');
                    } else if (token.min_transfer <= 0) {
                        throw new Error('Minimum Transfer must be greater than 0');
                    }
                }

                if ((requiredParams & TokenParams.max_transfer) === TokenParams.max_transfer) {
                    if (!token.max_transfer) {
                        throw new Error('Maximum Transfer not specified');
                    } else if (token.max_transfer <= 0) {
                        throw new Error('Maximum Transfer must be greater than 0');
                    } else if (!token.min_transfer) {
                        throw new Error('Minimum Transfer not specified');
                    } else if (token.max_transfer <= token.min_transfer) {
                        throw new Error('Maximum Transfer must be greater than Minimum Transfer');
                    }
                }

                if ((requiredParams & TokenParams.fee_divisor) === TokenParams.fee_divisor) {
                    if (!token.fee_divisor) {
                        throw new Error('Fee Divisor not specified');
                    } else if (token.fee_divisor < 1) {
                        throw new Error('Fee Divisor must be greater than 1');
                    }
                }
            }

            //Passed All Checks:
            token.loaded = true;

        } catch (error) {
            console.log(error);
        }

        return token;
    }

}