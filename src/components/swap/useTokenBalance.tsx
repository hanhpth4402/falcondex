import {useEffect, useMemo, useState} from "react";
import {fetchBalance} from "@wagmi/core";
import {useChainId, useContractRead} from "wagmi";

const useTokenBalance = ({token, address}: {token: `0x${string}`; address: `0x${string}`}) => {
    const chainId = useChainId();
    const [tokenBalance,setTokenBalance] = useState(0);
    const isNative = useMemo(() => (
        token === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" ||
        token === "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6" ||
        token === "0x139D5337deE3f1E3ba77368660715EBe9b1C3B03"
    ), [token]);
    useEffect(() => {
        if (isNative) fetchBalance({
            address,
            chainId
        }).then((data) => {
            setTokenBalance(Number(data.formatted));
        });
        else fetchBalance({
            address,
            token,
            chainId
        }).then((data) => {
            setTokenBalance(Number(data.formatted));
        });
    }, [address, chainId, token, isNative]);

    return tokenBalance;
};

export default useTokenBalance;
