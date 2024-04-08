'use client'
import {useAccount, useChainId, useProvider, useSigner} from "wagmi";
import {Contract} from "@ethersproject/contracts";
import {abiERC20} from "@/config/abi";
import {Interface} from "@ethersproject/abi";
import useSWRImmutable from "swr/immutable";

const getResult = async (methods: any[]): Promise<any> => {
    let result;
    try {
        result = await Promise.all(methods);
    } catch (e) {
        const length= methods.length;
        const middle = Math.floor(length/2);
        const method1 = methods.slice(0, middle);
        const method2 = methods.slice(middle+1, length-1);
        result = Promise.all([getResult(method1), getResult(method2)]);
    };
    return result;
}
const test = () => {
    const chainId = useChainId();
    const {data: signer} = useSigner();
    const provider = useProvider({chainId: 11155111});
    const signerOrProvider = signer ?? provider;

    const {address} = useAccount();

    const tokenContract = new Contract("0xf097Ab5d2E1499672EA7B17aC2e5552D88442D83", abiERC20, signerOrProvider);

    const contractInterface = new Interface(abiERC20);
    const abc = contractInterface.getFunction('balanceOf');
    console.log(abc)
    const callData = contractInterface.encodeFunctionData(abc, [address || "0xdfA674b075dE4677f7eCa3872EDE71310F5c6Be1"]);
    const { data: currentBlock = 0 } = useSWRImmutable(['blockNumber', chainId]);
    console.log(callData);

    tokenContract.functions['balanceOf']("0xdfA674b075dE4677f7eCa3872EDE71310F5c6Be1").then((data: any) => {
        console.log(data);
    })
    return (
        <>

        </>
    )
};

export default test;
