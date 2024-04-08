import {Contract} from "@ethersproject/contracts";
import {useAccount, useChainId, useProvider, useSigner} from "wagmi";
import {useCallback, useState} from "react";
import {HanhFarmAbi1, hanhFarms} from "@/config/configHanhFarm";
import {abiERC20} from "@/config/abi";
import BigNumber from "bignumber.js";
import {tokenList} from "@/config/tokenList";
import {ErrorType, StakeErrorModal} from "@/components/yieldFarming/components/farmModal/stakeErrorModal";
import useModal from "@/hooks/useModal";

const useStake = ({
    poolId,
    amount,
    farmAddress,
    setAttemptingTxn,
    setHash
}: {
    poolId: number,
    amount: string,
    farmAddress: string,
    setAttemptingTxn: (value: boolean) => void,
    setHash: (value: string) => void,
}): () => void => {
    const {address} = useAccount();
    const chainId = useChainId();
    const {data: signer} = useSigner();
    const provider = useProvider({chainId});
    const signerOrProvider = signer ?? provider;
    const farm = hanhFarms.find((item) => item.contract === farmAddress);
    const tokenAddress =  farm?.pools[poolId].stakeToken || "0xe9c7A1093a797aFcD6aeba65ea6a17AD610Cf019";

    const [onPresentZeroErrorModal] = useModal('Stake failed', <StakeErrorModal error={ErrorType.ZERO}/>);
    const [onPresentInsufficientErrorModal] = useModal('Stake failed', <StakeErrorModal error={ErrorType.INSUFFICIENT}/>);
    const [onPresentCommonErrorModal] = useModal('Stake failed', <StakeErrorModal error={ErrorType.COMMON}/>);

    return useCallback(() => {
        const farmContract = new Contract(farmAddress, HanhFarmAbi1, signerOrProvider);
        getToken(tokenAddress, chainId, signerOrProvider).then((result: any) => {
            const _decimal = Number(result[0].toString(10));
            const _exactAmount = new BigNumber(amount).multipliedBy(10**(_decimal));
            const exactAmount = _exactAmount.toString(10);
            console.log('poolId, exactAmount', poolId, exactAmount);
            setHash('');
            setAttemptingTxn(true);
            farmContract.estimateGas.deposit(poolId, exactAmount).then((estimateGas: any)=> {
                farmContract.deposit(poolId, exactAmount, {
                    gasLimit: estimateGas.mul(120).div(100),
                }).then((data: any)=> {
                    setAttemptingTxn(false);
                    console.log(data);
                }).catch((err: any) => {
                    setAttemptingTxn(false);
                });
            }).catch((err: any) => {
                setAttemptingTxn(false);
                const reason = err.reason;
                if (reason === "execution reverted: MasterChefV2: Insufficient Balance") onPresentInsufficientErrorModal();
                if (reason === "execution reverted: MasterChefV2: Deposit amount can't be zero") onPresentZeroErrorModal();
                onPresentCommonErrorModal();
            });
        })
    }, [chainId, farmAddress, amount, poolId, address, signerOrProvider]);
};

export default useStake;

const getToken = async (tokenAddress: string, chainId: number, signerOrProvider: any) => {
    const tokenContract = new Contract(tokenAddress, abiERC20, signerOrProvider);
    const token = tokenList.find((item) => item.address === tokenAddress);
    if (token) return [token.decimals, token.symbol];
    else await Promise.all([tokenContract.decimals(), tokenContract.symbol()])
}
