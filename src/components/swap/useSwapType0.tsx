import {Contract} from "@ethersproject/contracts";
import {tokenList} from "@/config/tokenList";
import {useCallback, useEffect, useMemo, useState} from "react";
import BigNumber from "bignumber.js";
import {field} from "@/state/swap/actionSwap";
import useBestTrade from "@/components/swap/useBestTrade";
import {abiFactoryChiHang} from "@/config/abi";
import {FactoryChiHang} from "@/config/configFactory";
import {Trade} from "@/components/swap/components/footerSwapForm";
import usePriceImpact from "@/components/swap/hooks/usePriceImpact";

function useSwapType0 (
    address: `0x${string}`,
    routeAddress: string,
    abiRoute: any,
    signerOrProvider: any,
    token0Address: `0x${string}`,
    token1Address: `0x${string}`,
    amount: string,
    independentField: field,
    slippageTolerance: string,
    setAttemptingTxn: (value: boolean) => void,

    setHash?: (value: `0x${string}`) => void,
    setNewTxn0?: (value: boolean) => void,
    setNewTxn1?: (value: boolean) => void,
): [Trade, [string, string], string, () => void] {
    // goi ham de lay ra in va out
    const routeContract = new Contract(routeAddress, abiRoute, signerOrProvider);
    const token0 = useMemo(() => (
        tokenList.find((item) => item.address === token0Address)
    ), [token0Address]);
    const token1 = useMemo(() => (
        tokenList.find((item) => item.address === token1Address)
    ), [token1Address]);

    const exactAmount = new BigNumber(
        (new BigNumber(amount).multipliedBy(10**Number(independentField === field.INPUT ? token0?.decimals : token1?.decimals)))
        .toFixed(0)).toString(10);

    const [exactAmountOut, setExactAmountOut] = useState('0');
    const [exactAmountIn, setExactAmountIn] = useState('0');

    let trade = useBestTrade(
        FactoryChiHang,
        abiFactoryChiHang,
        token0,
        token1,
        signerOrProvider
    );

    useEffect(() => {
        if (independentField === field.INPUT) {
            routeContract.getAmountsOut(exactAmount,
                [token0Address, token1Address])
                .then((data: any) => {
                    const exactOut = (data[1]).toString(10);
                    setExactAmountOut(exactOut);
                    setExactAmountIn(exactAmount);
                }).catch((err: any) => {
                console.log(err);
            })
        } else {
            routeContract.getAmountsIn(exactAmount,
                [token0Address, token1Address])
                .then((data: any) => {
                    const exactIn = (data[0]).toString(10);
                    setExactAmountIn(exactIn);
                    setExactAmountOut(exactAmount);
                }).catch((err: any) => {
            })
        }
    }, [exactAmount]);

    const amountIn = useMemo(() => (
        new BigNumber(exactAmountIn).div(10**(token0?.decimals || 0)).toString(10)
    ), [exactAmountIn]);
    const amountOut = useMemo(() => (
        new BigNumber(exactAmountOut).div(10**(token1?.decimals || 0)).toString(10)
    ), [exactAmountOut]);
    const deadline = (Number(new Date()) + 60*5).toString(10);

    //swap swap
    const estimateGasMethodSwap = routeContract.estimateGas.swapExactTokensForTokens;
    const methodSwap = routeContract.swapExactTokensForTokens;

    const [minimumExpectAmountOut, exactMinimumExpectAmountOut] = useMemo(() => {
        const _amount = BigNumber(exactAmountOut).multipliedBy(100 - Number(slippageTolerance))
            .dividedBy(100);

        return [_amount.toFixed(0), _amount.div(10**(token1?.decimals || 0)).toString()];
    }, [exactAmountOut, slippageTolerance]);

    const args = useMemo(() => (
        [
            exactAmountIn,
            minimumExpectAmountOut,
            [token0Address, token1Address],
            address,
            deadline
        ]
    ), [exactAmountIn, minimumExpectAmountOut,token0Address, token1Address, address, deadline]);

    trade.DetailInfo.PriceImpact = usePriceImpact({
        AmountIn: amountIn,
        AmountOut: amountOut,
        Price: trade.DetailInfo.Price,
        Reserves: trade.DetailInfo.Reserves
    });
    return [{...trade}, [amountIn, amountOut], exactMinimumExpectAmountOut, useCallback(() => {
        setAttemptingTxn(true);
        console.log('abcabc')
        estimateGasMethodSwap(...args).then((estimateGas) => {
            methodSwap(...args, {
                gasLimit: estimateGas
            }).then((data: any) => {
                setAttemptingTxn(false);
                if(setHash && setNewTxn0 && setNewTxn1) {
                    setHash(data.hash);
                    setNewTxn0(true);
                    setNewTxn1(true);
                }
                console.log('swap', data.hash);
            }).catch((err: any) => {
                setAttemptingTxn(false);
            })
        }).catch((err: any) => {
            console.log('loi swap', err);
            setAttemptingTxn(false);
        })
    }, [args, exactAmountIn, exactAmountOut, minimumExpectAmountOut, exactMinimumExpectAmountOut])]
}

export default useSwapType0;
