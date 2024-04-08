import {Contract} from "@ethersproject/contracts";
import {useCallback, useEffect, useState} from "react";
import Token from "@/entities/token";
import BigNumber from "bignumber.js";
import useModal from "@/hooks/useModal";
import {WithdrawErrorModal, WithdrawErrorType} from "@/components/yieldFarming/components/farmModal/withdrawErrorModal";
import getValue from "@/components/yieldFarming/hooks/constantFunction";

export interface UserInfo {
    amount: string,
    rewards: string,
    expireTime: string,
}
export const useUserInfo = (
    contract: Contract,
    poolId: number,
    userAddress: string,
    stakeToken: Token
): [UserInfo, boolean] => {
    const decimal = stakeToken.decimals;
    const [userInfo, setUserInfo] = useState<UserInfo>({
        amount: '0',
        rewards: '0',
        expireTime: '0',
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (contract && poolId && userAddress) {
            setLoading(true);
            getValue(contract, 'userInfo', [poolId, userAddress]).then((data: any) => {
                const _amount = new BigNumber(data.amount.toString(10));
                const _exactAmount = _amount.div(10**decimal).toString(10);
                const _rewards = data.rewards.toString(10);
                const _expireTime = data.expireTime.toString(10);
                setLoading(false);
                setUserInfo({
                    amount: _exactAmount,
                    rewards: _rewards,
                    expireTime: _expireTime
                })
            }).catch((err: any) => {
                setLoading(false);
            });
        }
    }, []);
    return [userInfo, loading];
}

export const useWithdraw = (
    farmContract: Contract,
    poolId: number,
    setAttemptingTxn: (value: boolean) => void,
    setHash: (value: string) => void,
): [() => void] => {
    const [onPresentWithdrawTimeError] = useModal('', <WithdrawErrorModal error={WithdrawErrorType.TIME}/>);
    const [onPresentWithdrawZeroError] = useModal('', <WithdrawErrorModal error={WithdrawErrorType.ZERO}/>);
    const [onPresentWithdrawInsufficientError] = useModal('', <WithdrawErrorModal error={WithdrawErrorType.INSUFFICIENT}/>);
    const [onPresentWithdrawCommonError] = useModal('', <WithdrawErrorModal error={WithdrawErrorType.COMMON}/>);


    return [useCallback(() => {
        setAttemptingTxn(true);
        farmContract.estimateGas.withdraw(poolId).then((data) => {
            console.log(data);
            farmContract.withdraw(poolId, {
                gasLimit: data.mul(120).div(100)
            }).then((data: any) => {
                setAttemptingTxn(false);
                console.log(data);
            }).catch((err: any) => {
                setAttemptingTxn(false);
                console.log(err);
            })
        }).catch((err) => {
            setAttemptingTxn(false);
            const reason = err.reason;
            if (reason === "execution reverted: MasterChefV2: It is not time to withdraw") onPresentWithdrawTimeError();
            else {
                if (reason === "execution reverted: MasterChefV2: Withdraw amount can't be zero") onPresentWithdrawZeroError();
                else {
                    if (reason === "execution reverted: MasterChefV2: Insufficient Balance") onPresentWithdrawInsufficientError();
                    else onPresentWithdrawCommonError();
                }
            }
            console.log('err.reason', err.reason);
        })
    }, [])]
}
