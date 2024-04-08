import {Contract} from "@ethersproject/contracts";
import Token from "@/entities/token";
import {useEffect, useState} from "react";
import {HanhFarmAbi1} from "@/config/configHanhFarm";
import BigNumber from "bignumber.js";
import getValue from "@/components/yieldFarming/hooks/constantFunction";

const useHarvestReward = (contractAddress: string, poolId: number, address: `0x${string}` | undefined, rewardToken: Token, signerOrProvider: any, fee: number): [string, boolean] => {
    const [amount, setAmount] = useState('0');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (contractAddress && poolId && address && rewardToken && signerOrProvider && fee) {
            const contract = new Contract(contractAddress, HanhFarmAbi1, signerOrProvider);
            setLoading(true);
            getValue(contract, 'userInfo', [poolId, address]).then((result: any) => {
                const _reward = result.rewards.toString(10);
                const _rewardDebt = result.rewardDebt.toString(10);
                const _decimals = rewardToken.decimals;
                const reward = new BigNumber(_reward).multipliedBy((100-fee)/100).div(10**_decimals).toString(10);
                setLoading(false);
                setAmount(reward);
            }).catch((err) => {
                setLoading(false);
            })
        }
    }, []);
    return [amount, loading]
}

export default useHarvestReward;
