import {useAccount, useChainId} from "wagmi";
import {tokenList} from "@/config/tokenList";
import BigNumber from "bignumber.js";
import {Contract} from "@ethersproject/contracts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {field} from "@/state/swap/actionSwap";
import {PrimaryFactoryAddress, PrimaryPairAbi, PrimaryRouteAbi, PrimaryRouteAddress} from "@/config/configFactory";
import {useSelector} from "react-redux";
import {useAdvanceDetail, useAllAddLiquidity} from "@/components/addLiquidity/hooks/useLiquidityToken";

export interface AdvancedDetail {
    mintedLiquidity: string,
    poolTokenPercentage: string,
    price: string,
    pairAddress: string,
    tokens: string[],
    reserves: string[],
    pairLoading?: boolean
}
export function useAddliquidity (
    signerOrProvider: any,
    chainId: number,
    slippageTolerance: number,
    setAttemptingTxn: (value: boolean) => void,
    setHash?: (value: `0x${string}`) => void,
    setNewTxn0?: (value: boolean) => void,
    setNewTxn1?: (value: boolean) => void
): ([formatted: string[], callBack: ()=>void, advancedDetail: AdvancedDetail]) {
    const {address} = useAccount();
    const {
        independentField,
        [field.INPUT]: {
            currencyId: token0Id,
            value: value0,
        },
        [field.OUTPUT]: {
            currencyId: token1Id,
            value: value1,
        },
        slippageTolerance: st,
    } = useSelector((state: {addLiquidity: any}) => state.addLiquidity);

    const [Reserves, Supply, Liquidity, {address: PairAddress, loading: PairLoading}] =
        useAllAddLiquidity([token0Id, token1Id], signerOrProvider);
    const [amounts, setAmounts] = useState(['0', '0']);

    useEffect (() => {
        if (Liquidity) {
            const exactValue0 = new BigNumber(value0);
            const exactValue1 = new BigNumber(value1);
            if (independentField === field.INPUT) {
                if (exactValue0.isEqualTo(0)) {
                    setAmounts(['0', '0']);
                } else {
                    const temp = exactValue0.multipliedBy(Reserves[1]).dividedBy(Reserves[0]);
                    setAmounts([exactValue0.toString(10), temp.toString(10)]);
                }
            } else {
                if (exactValue1.isEqualTo(0)) {
                    setAmounts(['0', '0']);
                } else {
                    const temp = exactValue1.multipliedBy(Reserves[0]).dividedBy(Reserves[1]);
                    setAmounts([temp.toString(10), exactValue1.toString(10)]);
                }
            }
        } else {
            setAmounts([value0, value1]);
        }
    }, [Liquidity, value0, value1]);

    const [mintedLiquidity, poolTokenPercentage, price] = useAdvanceDetail(Reserves, amounts, Supply);
    const [methodAddLiquidity, estimateGas, args]= getArgs(
        chainId,
        [token0Id, token1Id],
        amounts,
        address,
        signerOrProvider,
        slippageTolerance
    );
    const routeContract = new Contract(PrimaryRouteAddress, PrimaryRouteAbi, signerOrProvider);

    return [
        amounts,
        () => {
            setAttemptingTxn(true);
            routeContract.estimateGas.addLiquidity(...args).then((estimateGas: any) => {
                console.log(estimateGas);
                methodAddLiquidity(...args, {
                    gasLimit: estimateGas?.mul(120)?.div(100)
                }).then((respond: any) => {
                    setAttemptingTxn(false);
                    if(setHash && setNewTxn0 && setNewTxn1) {
                        setHash(respond.hash);
                        setNewTxn0(true);
                        setNewTxn1(true);
                    }
                    console.log(respond);
                }).catch((err: any) => {
                    setAttemptingTxn(false);
                })
            }).catch((err: any) => {
                setAttemptingTxn(false);
            })
        },
        {
            mintedLiquidity,
            poolTokenPercentage,
            price,
            pairAddress: PairAddress,
            tokens: [token0Id, token1Id],
            reserves: Reserves,
            pairLoading: PairLoading
        }
    ]
}
const getArgs = (
    chainId: number,
    tokenPath: string[],
    amount: string[],
    address: `0x${string}` | undefined,
    signerOrProvider: any,
    slippageTolerance: number
): [any, any, any[]] => {
    const inputIsNative = tokenList.find((item) =>
        (item.address === tokenPath[0]))?.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    const outputIsNative = tokenList.find((item) =>
        (item.address === tokenPath[1]))?.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

    const decimal0 = tokenList.find((item) =>
        item.address === tokenPath[0])?.decimals;
    const decimal1 = tokenList.find((item) =>
        item.address === tokenPath[1])?.decimals;

    const routeContract = new Contract(PrimaryRouteAddress, PrimaryRouteAbi, signerOrProvider);
    const deadline = `${(Number((Number(new Date())/1000).toFixed(0)) + 60*10).toString(10)}`;
    const [methodAddLiquidity, estimateGas, args] = useMemo(() => {
        const _slippageTolerance = ((1-slippageTolerance/100) > 0 && (1-slippageTolerance/100) < 1) ? 1-slippageTolerance/100 : 0.9995;
        const min_in = (new BigNumber(Number(amount[0])).multipliedBy(10**(decimal0||0)).multipliedBy(_slippageTolerance).toFixed(0)).toString();
        const min_out = (new BigNumber(Number(amount[1])).multipliedBy(10**(decimal1||0)).multipliedBy(_slippageTolerance).toFixed(0)).toString();

        const _in = (new BigNumber(Number(amount[0])).multipliedBy(10**(decimal0||0)).toFixed(0)).toString();
        const _out = (new BigNumber(Number(amount[1])).multipliedBy(10**(decimal1||0)).toFixed(0)).toString();
        if (inputIsNative || outputIsNative) {
            const args = [
                inputIsNative ? tokenPath[1] : tokenPath[0],
                inputIsNative ? amount[1] : amount[0],
                inputIsNative ? min_out : min_in,
                inputIsNative ? min_in : min_out,
                address,
                deadline
            ]
            return [routeContract.addLiquidityETH, routeContract.estimateGas.addLiquidityETH, args];
        }
        const args = [
            tokenPath[0],
            tokenPath[1],
            _in,
            _out,
            min_in,
            min_out,
            address,
            deadline
        ]
        return [routeContract.addLiquidity, routeContract.estimateGas.addLiquidity, args];
    }, [inputIsNative, outputIsNative, amount]);

    return [methodAddLiquidity, estimateGas, args];
}
