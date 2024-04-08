import {useChainId, useProvider, useSigner} from "wagmi";
import {Contract} from "@ethersproject/contracts";
import {abiERC20} from "@/config/abi";
import Token from "@/entities/token";
import {useEffect, useMemo, useState} from "react";

const useToken = (tokenAddress: `0x${string}`): Token => {
    const [token, setToken] = useState<Token>({
        name: '',
        address: tokenAddress,
        symbol: '',
        decimals: 0,
        chainId: 0,
    })

    const chainId   = useChainId();
    const {data: signer} = useSigner();
    const provider = useProvider({chainId});
    const signerOrProvider = signer ?? provider;

    const tokenContract = new Contract(tokenAddress, abiERC20, signerOrProvider);
    const getName = tokenContract.name;
    const getSymbol = tokenContract.symbol;
    const getDecimals = tokenContract.decimals;
    useEffect(() => {
        Promise.all([getName(), getSymbol(), getDecimals()]).then((result: any) => {
            setToken({
                name: result[0],
                address: tokenAddress,
                symbol: result[1],
                decimals: result[2],
                chainId: chainId
            })
        })
    }, [tokenAddress]);
    return useMemo(() => (token), [token]);
};

export default useToken;
