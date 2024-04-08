import {abiERC20} from "@/config/abi";
import {useEffect, useState} from "react";
import {tokenList} from "@/config/tokenList";
import {Contract} from "@ethersproject/contracts";
import BigNumber from "bignumber.js";
export const enum ApproveState {
    APPROVED,
    NOT_APPROVED
}
export function useApprove (tokenAddress: string, amount: number, address: `0x${string}`, spender: string, signerOrProvider: any, decimal?: number):
    ([ApproveState, ()=>void, boolean]) {
    const [exactApproveAmount, setExactApproveAmount] = useState(0);
    const ERC20TokenContract = new Contract(tokenAddress, abiERC20, signerOrProvider);
    const token = decimal ? {decimals: decimal} : tokenList.find((item) => item.address === tokenAddress);
    const _amount = BigNumber((amount * 10**(token?.decimals || 0)).toFixed(0)).toString(10);

    const [attemptingTxn, setAttemptingTxn] = useState(false);

    useEffect(() => {
        ERC20TokenContract?.functions.allowance(address, spender).then((data) => {
            const approvedAmount = Number(data[0].toString()); ///Number for temporary, big number is better;
            setExactApproveAmount(approvedAmount / 10**(Number(token?.decimals)));
        });
    }, [amount]);

    if (exactApproveAmount >= amount) {
        return [ApproveState.APPROVED, () => {}, false];
    };


    return [ApproveState.NOT_APPROVED, () => {
        setAttemptingTxn(true);
        ERC20TokenContract?.estimateGas.approve(spender, _amount).then((estimateGas) => {
            console.log('estimateGas', estimateGas);
            ERC20TokenContract?.approve(spender, _amount, {
                gasLimit: estimateGas.mul(120).div(100),
            }).then((response: any) => {
                setAttemptingTxn(false);
                console.log(response);
            }).catch((err: any) => {
                setAttemptingTxn(false);
            })
        }).catch((err) => {
            setAttemptingTxn(false);
        })
    }, attemptingTxn];
}

