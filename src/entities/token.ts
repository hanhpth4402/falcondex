interface Token {
    name: string,
    address: `0x${string}`,
    symbol: string,
    decimals: number,
    chainId: number,
    logoURI?: string,
}

export default Token;
