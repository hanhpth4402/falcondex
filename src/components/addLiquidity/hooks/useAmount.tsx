import {Contract} from "@ethersproject/contracts";
import {abiERC20} from "@/config/abi";
import {useEffect, useMemo, useState} from "react";
import {tokenList} from "@/config/tokenList";
import BigNumber from "bignumber.js";
import {useAccount, useBalance, useChainId, useProvider, useSigner} from "wagmi";
import {errors} from "web3";

const useAmount = (tokens: `0x${string}`[], balances: string[], formatted: string[])
    :[boolean[], string[]] => {
    const check0 = useMemo(() => {
        const _balance = new BigNumber(balances[0] || '0');
        const _amount = new BigNumber(formatted[0]);
        return _balance.comparedTo(_amount) === 1 || _balance.comparedTo(_amount) === 0;
    }, [formatted[0]]);

    const check1 = useMemo(() => {
        const _balance = new BigNumber(balances[1] || '0');
        const _amount = new BigNumber(formatted[1]);
        return _balance.comparedTo(_amount) === 1;
    }, [formatted[1]]);

    const symbol0 = useMemo(() => {
        return tokenList.find((item) => item.address === tokens[0])?.symbol || ''
    }, [tokens[0]]);
    const symbol1 = useMemo(() => {
        return tokenList.find((item) => item.address === tokens[1])?.symbol || ''
    }, [tokens[1]]);
    return useMemo(() => ([
        [check0, check1],
        [symbol0, symbol1],
    ]), [symbol0, symbol1, check0, check1])
};

export default useAmount;
