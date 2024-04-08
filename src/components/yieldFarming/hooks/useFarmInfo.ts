import { farms } from "@/config/configFarm";
import Token from "@/entities/token";
import {hanhFarms} from "@/config/configHanhFarm";

export const useFarmInfo = (chainId: number, tokenList: Token[]) => {
    const allAvailableTokens = tokenList.filter((token) => token.chainId === chainId);

    return chainId ?
        hanhFarms
            .filter((farm) => farm.network === chainId)
            .flatMap((farm) => farm.pools.map((pool) => ({
                ...pool,
                network: farm.network,
                contract: farm.contract,
                rewardToken: allAvailableTokens.find((token) => token.address.toLowerCase() === farm.rewardToken.toLowerCase()) || allAvailableTokens[0],
                stakeToken: allAvailableTokens.find((token) => token.address.toLowerCase() === pool.stakeToken.toLowerCase()) || allAvailableTokens[0],
                token0: allAvailableTokens.find((token) => token.address.toLowerCase() === pool.token0.toLowerCase()) || allAvailableTokens[0],
                token1: allAvailableTokens.find((token) => token.address.toLowerCase() === pool.token1.toLowerCase()) || allAvailableTokens[0],
            }))) :
        [];
}
