import {getCreate2Address} from "@ethersproject/address";
import {keccak256, pack} from "@ethersproject/solidity";

const usePairAddress = ({factoryAddress, initCodeHash, tokenAddress1, tokenAddress2}: {
    factoryAddress: string, initCodeHash: string, tokenAddress1: string, tokenAddress2: string
}) => {
    const [token1, token2] = (tokenAddress1.toLowerCase() < tokenAddress2.toLowerCase())
        ? [tokenAddress1, tokenAddress2] : [tokenAddress2, tokenAddress1];
    return getCreate2Address(
        factoryAddress,
        keccak256(['bytes'], [pack(['address', 'address'], [token1, token2])]),
        initCodeHash)
};

export default usePairAddress;
