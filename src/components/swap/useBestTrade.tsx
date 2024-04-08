import {Contract} from "@ethersproject/contracts";
import {abiPair, abiPairChiHang} from "@/config/abi";
import {Trade} from "@/components/swap/components/footerSwapForm";
import {useEffect, useMemo, useState} from "react";
import BigNumber from "bignumber.js";
import {tokenList} from "@/config/tokenList";
import Token from "@/entities/token";
import {useAccount} from "wagmi";

const getPair = async (factoryContract: Contract, tokens:`0x${string}`[]): Promise<any> => {
    let result;
    try {
        result = await factoryContract.getPair(tokens[0], tokens[1]);
    } catch (e) {
        return getPair(factoryContract, tokens);
    }
    return result;
}

const getReserves = async (pairContract: Contract): Promise<any> => {
    let result;
    try {
        result = pairContract.getReserves();
    } catch (e) {
        return getReserves(pairContract);
    }
    return result;
}

const useBestTrade = (
    factoryAddress: string,
    abi: any,
    currency0: Token | undefined,
    currency1: Token | undefined,
    signerOrProvider: any,
): Trade => {
    const [pairAddress, setPairAddress] = useState({
        address: '',
        loading: false,
    });
    const [price, setPrice] = useState('0');
    const [reserves, setReserves] = useState<string[]>(['0', '0']);
    const {address} = useAccount();

    useEffect(() => {
        if (factoryAddress && currency0?.address && currency1?.address && abi && signerOrProvider && address) {
            const factoryContract = new Contract(factoryAddress, abi, signerOrProvider);
            const tokens = [currency0?.address, currency1?.address];
            setPairAddress(prevState => ({
                ...prevState,
                loading: true,
            }))
            getPair(factoryContract, tokens).then((data: any) => {
                console.log(data);
                setPairAddress({
                    address: data,
                    loading: false,
                });
                const pairContract = new Contract(`${data}`, abiPairChiHang, signerOrProvider);
                getReserves(pairContract).then((data: any) => {
                    const reserves0 = Number(data?.[0])/(10**(currency0?.decimals || 0));
                    const reserves1 = Number(data?.[1])/(10**(currency1?.decimals || 0));
                    const resStr0 = new BigNumber(reserves0).toString(10);
                    const resStr1 = new BigNumber(reserves1).toString(10);
                    const exactPrice = new BigNumber(reserves1 / reserves0 );

                    setReserves([resStr0, resStr1]);
                    setPrice(exactPrice.toString(10));

                })
            })
        }
    }, [factoryAddress, currency0?.address, currency1?.address, abi, signerOrProvider]);

    return {
        Token0: currency0?.symbol || "",
        Token1: currency1?.symbol || "",
        Currency0Id: currency0?.address || '',
        Currency1Id: currency1?.address || '',
        Pair: {
            PairAddress: pairAddress.address,
            PairLoading: pairAddress.loading,
        },
        DetailInfo: {
            Price: price,
            Reserves: reserves,
            DetailLoading: true
        }
    }
};

export default useBestTrade;
