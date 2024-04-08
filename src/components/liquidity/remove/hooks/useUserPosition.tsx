import {useEffect, useMemo, useState} from "react";
import {Contract} from "@ethersproject/contracts";
import {PrimaryFactoryAbi, PrimaryFactoryAddress, PrimaryPairAbi} from "@/config/configFactory";
import {tokenList} from "@/config/tokenList";
import BigNumber from "bignumber.js";
export interface userPositionType {
    pairAddress: string
    totalSupply: string;
    res: [string, string];
    userPosition: [string, string];
    balance: string,
    decimal: number,
    isFetching: boolean,
}
const useUserPosition = (
    walletAddress: string,
    token0: string,
    token1: string,
    signerOrProvider: any,
) => {
    const [result, setResult] = useState<userPositionType>({
        pairAddress: '0x0',
        totalSupply: '0',
        res: ['0', '0'],
        userPosition: ['0', '0'],
        balance: '0',
        decimal: 0,
        isFetching: true,
    });
    const factoryContract = new Contract(PrimaryFactoryAddress, PrimaryFactoryAbi, signerOrProvider);

    useEffect(() => {
        factoryContract.getPair(token0, token1).then((pairAddress: any) => {
            if (pairAddress !== "0x0000000000000000000000000000000000000000".toLowerCase()) {
                const pairContract = new Contract(pairAddress, PrimaryPairAbi, signerOrProvider);

                const getTotalSupply = pairContract.totalSupply;
                const getDecimals = pairContract.decimals;
                const getReserves = pairContract.getReserves;
                const getBalance = pairContract.balanceOf;

                Promise.all([getTotalSupply(), getDecimals(), getReserves(), getBalance(walletAddress)]).then((result) => {
                    const _supply = result[0].toString();
                    const _decimal = Number(result[1]);
                    const _totalSupply = new BigNumber(_supply).div(10**_decimal);
                    const totalSupply = _totalSupply.toString(10);

                    const [res0, res1] = convertReserves(token0, token1, result[2]);

                    const _balance = result[3].toString(10);
                    const _balanceOf = new BigNumber(_balance).div(10**_decimal);
                    const balanceOf = _balanceOf.toString();

                    const [pooled0, pooled1] = [res0.multipliedBy(_balanceOf).div(_totalSupply), res1.multipliedBy(_balanceOf).div(_totalSupply)]
                    setResult({
                        pairAddress,
                        totalSupply,
                        res: [res0.toString(10), res1.toString(10)],
                        userPosition: [pooled0.toString(10), pooled1.toString(10)],
                        balance: balanceOf,
                        decimal: _decimal,
                        isFetching: false
                    });
                })
            } else {
                setResult({
                    pairAddress,
                    totalSupply: '0',
                    res: ['0', '0'],
                    userPosition: ['0', '0'],
                    balance: '0',
                    decimal: 0,
                    isFetching: false
                });
            }
        })
    }, [walletAddress, token0, token1, signerOrProvider]);
    return useMemo(() => (result), [result]);
}

const convertReserves = (token0: string, token1: string, data: any[]): [BigNumber, BigNumber] => {
    const decimal0 = tokenList.find((item) => item.address === token0)?.decimals || 0;
    const decimal1 = tokenList.find((item) => item.address === token1)?.decimals || 0;
    const [res0, res1] = token0 < token1 ? [data[0].toString(10), data[1].toString(10)] : [data[1].toString(10), data[0].toString(10)];
    const _res0 = new BigNumber(res0).div(10**decimal0);
    const _res1 = new BigNumber(res1).div(10**decimal1);

    return [_res0, _res1];
}

export default useUserPosition;
