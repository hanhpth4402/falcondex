import {Chain, configureChains, createClient} from "wagmi";
import {jsonRpcProvider} from "wagmi/providers/jsonRpc";
import {MetaMaskConnector} from "@wagmi/connectors/metaMask";
import {CoinbaseWalletConnector} from "@wagmi/connectors/coinbaseWallet";
import { CHAINS } from "@/config/networks";

export const { provider, chains } = configureChains(CHAINS, [
    jsonRpcProvider({
        rpc: (chain: Chain) => {
            return { http: chain.rpcUrls.default.http[0] };
        },
    }),
]);
export const client = createClient({
    autoConnect: true,
    provider,
    connectors: [
        new MetaMaskConnector({
            chains,
            options: {
                shimDisconnect: true,
            }
        }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'CoinbaseWallet',
                appLogoUrl: '', // TODO
            },
        })
    ]
})

