
///can co token amount, reserves, totalSupply: tat ca nhung token da phat hanh
import {Contract} from "@ethersproject/contracts";
import BigNumber from "bignumber.js";
import {useEffect, useMemo, useState} from "react";
import {PrimaryFactoryAbi, PrimaryFactoryAddress, PrimaryPairAbi} from "@/config/configFactory";
import {tokenList} from "@/config/tokenList";

const getPoolTokenPercentage = (liquidityMinted: string, totalSupply: string) => {
    const _liquidityMinted = new BigNumber(liquidityMinted);
    const _totalSupply = new BigNumber(totalSupply);
    return _liquidityMinted.dividedBy(_totalSupply.plus(_liquidityMinted)).multipliedBy(100).toFixed(2);
}

export const getMintedLiquidityToken = (reserves: string[], amounts: string[], totalSupply: string) => {
    let liquidity
    const _totalSupply = new BigNumber(totalSupply);

    const _reserve0 = new BigNumber(reserves[0]);
    const _reserve1 = new BigNumber (reserves[1]);

    const _amount0 = new BigNumber(amounts[0]);
    const _amount1 = new BigNumber(amounts[1]);

    if (_totalSupply.isEqualTo(0)){
        liquidity = _amount0.multipliedBy(_amount1).sqrt();
    } else {
        const tmp1 = _amount0.multipliedBy(_totalSupply).div(_reserve0.plus(_amount0));
        const tmp2 = _amount1.multipliedBy(_totalSupply).div(_reserve1.plus(_amount1));
        liquidity = tmp1.comparedTo(tmp2) === 1 ? tmp2 : tmp1;
    }
    return liquidity.toString();
}

const singleContractMultiMethod = async (contract: Contract, methods: string[], args: any[][]): Promise<any> => {
    let result;
    try {
        result = await Promise.all(methods.map((method, index) => contract.functions[method](...args[index])));
    } catch (e) {
        return singleContractMultiMethod(contract, methods, args);
    }
    return result;
}

const singleContractSingleMethod = async (contract: Contract, method: string, args: any[]): Promise<any> => {
    let result;
    try {
        result = await contract.functions[method](...args);
    } catch (e) {
        return singleContractSingleMethod(contract, method, args);
    }

    return result;
};

export const useAllAddLiquidity = (tokens: `0x${string}`[], signerOrProvider: any) : [string[], string, boolean, {address: string, loading: boolean}] => {
    const [lpTokenAddress, setLpTokenAddress] = useState("0x0000000000000000000000000000000000000000");
    const [loading, setLoading] = useState(false);
    const [reserves, setReserves] = useState(['0', '0']);
    const [supply, setSupply] = useState('0');

    const decimal0 = tokenList.find((item) =>
        item.address === tokens[0])?.decimals;
    const decimal1 = tokenList.find((item) =>
        item.address === tokens[1])?.decimals;

    useEffect(() => {
        if (tokens[0] && tokens[1] && signerOrProvider) {
            const factoryContract = new Contract(PrimaryFactoryAddress, PrimaryFactoryAbi, signerOrProvider);
            setLoading(true);
            singleContractSingleMethod(factoryContract, 'getPair', tokens).then((data) => {
                if (data.toString() !== "0x0000000000000000000000000000000000000000") {
                    const pairAddress = data.toString() || `0x0`;
                    const pairContract = new Contract(`${pairAddress}`, PrimaryPairAbi, signerOrProvider);
                    const getReserves = singleContractSingleMethod(pairContract, 'getReserves', []);

                    getReserves.then((data) => {
                        const Reserves = tokens[0]<tokens[1] ? [data[0], data[1]] : [data[1], data[0]];
                        const _res0 = new BigNumber(Reserves[0].toString()).dividedBy(10**(decimal0 || 0)).toString();
                        const _res1 = new BigNumber(Reserves[1].toString()).dividedBy(10**(decimal1 || 0)).toString();
                        setReserves([_res0, _res1]);
                    });
                    const getSupply = singleContractMultiMethod(pairContract, ['totalSupply', 'decimals'], [[], []]);
                    getSupply.then((data) => {
                        const Supply = new BigNumber(data[1].toString());
                        const Decimal = Number((data[2] || 0).toString());
                        const _supply = Supply.dividedBy(10**Decimal).toString();
                        setSupply(_supply);
                    });
                    setLpTokenAddress(pairAddress);
                    setLoading(false);
                }
            }).catch((err: any) => {
                setLoading(false);
            })
        }
    }, [tokens[0], tokens[1], signerOrProvider]);

    return useMemo(() =>
        ([reserves, supply, lpTokenAddress !== "0x0000000000000000000000000000000000000000", {address: lpTokenAddress, loading: loading}]),
        [reserves, supply, lpTokenAddress]);
}

export const useAdvanceDetail = (Reserves: string[], Amounts: string[], Supply: string): [string, string, string] => {
    const mintedLiquidityToken = getMintedLiquidityToken(Reserves, Amounts, Supply);
    const impact = getPoolTokenPercentage(mintedLiquidityToken, Supply);
    const price = new BigNumber(Reserves[0]).dividedBy(new BigNumber(Reserves[1])).toString();
    return [mintedLiquidityToken, impact, price];
}
export default getMintedLiquidityToken;
