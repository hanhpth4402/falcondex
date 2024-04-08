import BigNumber from "bignumber.js";

const usePriceImpact = ({
    AmountIn,
    AmountOut,
    Price,
    Reserves
}: {
    AmountIn: string,
    AmountOut: string,
    Price: string,
    Reserves: string[]
}): string => {
    const newRes0 = new BigNumber(Reserves[0]).plus(new BigNumber(AmountIn));
    const newRes1 = new BigNumber(Reserves[1]).minus(new BigNumber(AmountOut));

    const oldPrice = new BigNumber(Price);
    const newPrice = newRes1.div(newRes0);
    ////case neu out vuot qua reserves
    return Math.abs((1-Number(newPrice.div(oldPrice)))*100).toFixed(2);
};

export default usePriceImpact;
