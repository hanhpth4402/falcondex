import {tokenList} from "@/config/tokenList";
import BigNumber from "bignumber.js";

export const useConvertNumberToUint256 = (
    numberIn: any,
    token: string,
): string => {
    const exactNumber = Number(numberIn);
    const tokenDecimals = Number(tokenList
        .find((item) => item.address === token)?.decimals);
    return (new BigNumber(exactNumber * 10**tokenDecimals)).toFixed(0).toString();
}

export const useConvertUint256ToNumber = (
    numberIn: any,
    token: string,
): string => {
    const exactNumber = new BigNumber(numberIn.toString());
    const tokenDecimals = tokenList
        .find((item) => item.address === token)?.decimals || 0;
    return new BigNumber(exactNumber.div(new BigNumber(10**tokenDecimals ))).toString(10);
}
