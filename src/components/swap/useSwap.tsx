import {useProvider, useSigner} from "wagmi";
import {Contract} from "@ethersproject/contracts";
import {abiRouterV2Uniswap} from "@/config/abi";
import {tokenList} from "@/config/tokenList";
import {useMemo} from "react";

export function useSwap (
    [tokenAddress1, tokenAddress2]: [string, string],
    chainId: number,
    inputValue: string,
    outputValue: string,
    routeAddress: string,
    address: string,
): (()=> void)
{
    const {data: signer} = useSigner();
    const provider = useProvider({chainId: 11155111});
    const routeContract = new Contract(
        routeAddress,
        abiRouterV2Uniswap,
        signer ?? provider
    );

    const inputIsNative = tokenList.find((item) =>
        item.address === tokenAddress1)?.symbol === "WETH";
    const outputIsNative = tokenList.find((item) =>
        item.address === tokenAddress1)?.symbol === "WETH";

    const methodSwap = useMemo(() => {
        if (inputIsNative) return routeContract.swapExactETHForTokens;
        if (outputIsNative) return routeContract.swapExactTokensForETH;
        return routeContract.swapExactTokensForTokens;
    }, [inputIsNative, outputIsNative]);

    // const estimateGas = useMemo(() => {
    //
    // })
    return () => {}
}
