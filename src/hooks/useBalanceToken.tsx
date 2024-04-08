import {useAccount, useChainId, useProvider, useSigner, useTransaction} from "wagmi";
import {useEffect, useMemo, useState} from "react";
import {Contract} from "@ethersproject/contracts";
import {abiERC20} from "@/config/abi";
import BigNumber from "bignumber.js";

const useBalanceToken = (addressToken: string) => {
    const [balance, setBalance] = useState('0');

    const chainId = useChainId();

    const {data: signer} = useSigner();
    const provider = useProvider({chainId});
    const signerOrProvider = signer ?? provider;

    const {address} = useAccount();
    useEffect(() => {
        const tokenContract = new Contract(addressToken, abiERC20, signerOrProvider);
        const getBalance = tokenContract.balanceOf;
        const getDecimals = tokenContract.decimals;
        Promise.all([getBalance(address), getDecimals()]).then((result) => {
            const _balance = new BigNumber(result[0].toString(10));
            const _decimals = Number(result[1].toString(10));

            const balance = _balance.div(10**_decimals);
            setBalance(balance.toString(10));
        }).catch((err: any)=> {
            setBalance('0');
        });
    }, [address, addressToken, signerOrProvider]);
    return balance;
}

const getBalance = async (tokenContract: Contract, address: `0x${string}`): Promise<any> => {
    let result;
    try {
        result = await Promise.all([tokenContract.functions['balanceOf'](address), tokenContract.functions['decimals']()])
    } catch (e) {
        return getBalance(tokenContract, address);
    };
    return result;
}

export const useBalance = (token: `0x${string}`, address: `0x${string}` | undefined, signerOrProvider: any, hash?: `0x${string}`, newTxn?: boolean, setNewTxn?: (value: boolean) => void): [balance: string, loading: boolean] => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState('0');
    const [decimal, setDecimal] = useState(0);
    const chainId = useChainId();

    const result = useTransaction({hash});

    useEffect(() => {
        const id = setInterval(() => {
            if (result.isSuccess && newTxn) {
                console.log('re-calculate');
                const tokenContract = new Contract(token, abiERC20, signerOrProvider);
                setLoading(true);
                tokenContract.functions['balanceOf'](address).then((data) => {
                    const _currentBalance = new BigNumber(data.toString(10));
                    const CurrentBalance = _currentBalance.div(10**decimal);
                    if (!CurrentBalance.isEqualTo(new BigNumber(balance))) {
                        setLoading(false);
                        setBalance(CurrentBalance.toString(10));
                        if (setNewTxn) setNewTxn(false);
                    }
                }).catch((err) => {
                    setLoading(false);
                    if (setNewTxn) setNewTxn(false);
                })
            }
        }, 3000);
        return (() => {
            clearInterval(id);
        })
    }, [result, newTxn]);

    useEffect(() => {
        if (token && address && signerOrProvider && chainId) {
            const tokenContract = new Contract(token, abiERC20, signerOrProvider);
            const promise = getBalance(tokenContract, address);
            setLoading(true);
            promise.then((data) => {
                const _balance = new BigNumber(data[0].toString(10));
                const _decimal = Number(data[1].toString(10));
                const balance = _balance.div(10**_decimal);
                setBalance(balance.toString(10));
                setDecimal(_decimal);
                setLoading(false);
            }).catch((data) => {
                setLoading(false);
            })
        }
    }, [token, address, signerOrProvider, chainId, hash]);

    return [balance, loading];
}

export default useBalanceToken;
