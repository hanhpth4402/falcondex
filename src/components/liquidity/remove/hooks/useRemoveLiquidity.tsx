import {Contract} from "@ethersproject/contracts";
import {PrimaryRouteAbi, PrimaryRouteAddress} from "@/config/configFactory";
import {tokenList} from "@/config/tokenList";
import BigNumber from "bignumber.js";
import {useCallback} from "react";

const useRemoveLiquidity = ({token0, token1, personalLiquidity, totalLiquidity, range, res, lpTokenDecimal, addressTo, signerOrProvider, setAttemptingTxn}: {
    token0: string,
    token1: string,

    personalLiquidity: string,
    totalLiquidity: string,
    range: number,
    res: string[],
    lpTokenDecimal: number

    addressTo: string,
    signerOrProvider: any,
    setAttemptingTxn: (value: boolean) => void
}) => {
    const decimal0 = tokenList.find((item) => item.address === token0)?.decimals || 0;
    const decimal1 = tokenList.find((item) => item.address === token1)?.decimals || 0;
    const decimals = [decimal0, decimal1];

    const _yourLiquidity = new BigNumber(personalLiquidity).multipliedBy(10**lpTokenDecimal).multipliedBy(range).div(100);
    const _totalLiquidity = new BigNumber(totalLiquidity).multipliedBy(10**lpTokenDecimal);
    const liquidityRatio = _yourLiquidity.div(_totalLiquidity);
    const amountLiquidity = _yourLiquidity.toFixed(0);

    const amountToken0 = new BigNumber(res[0]).multipliedBy(liquidityRatio).multipliedBy(10**decimals[0]).multipliedBy(0.9995).toFixed(0);
    const amountToken1 = new BigNumber(res[1]).multipliedBy(liquidityRatio).multipliedBy(10**decimals[1]).multipliedBy(0.9995).toFixed(0);

    const deadline = `${(Number((Number(new Date())/1000).toFixed(0)) + 60*5).toString(10)}`;

    const args = [
        token0,
        token1,
        amountLiquidity,
        amountToken0,
        amountToken1,
        addressTo,
        deadline
    ];

    const routerContract = new Contract(PrimaryRouteAddress, PrimaryRouteAbi, signerOrProvider);
    const estimateFunction = routerContract.estimateGas.removeLiquidity;
    const removeLiquidityFunction = routerContract.removeLiquidity;

    return useCallback(() => {
        setAttemptingTxn(true);
        removeLiquidityFunction(...args).then((data: any) => {
            console.log(data);
            setAttemptingTxn(false);
        }).catch((err: any) => {
            console.log(err);
            setAttemptingTxn(false);
        })
    }, [args]);
}

const getExactAmount = (amount: string) => {
    const [num0, num1] = amount.split('.');
    return num0;
}

export default useRemoveLiquidity;

