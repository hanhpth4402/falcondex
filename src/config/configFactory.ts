import {abiFactoryChiHang, abiPairChiHang, abiRouteChiHang} from "@/config/abi";
import {RouteChiHang} from "@/config/configRoute";

export const FactoryUniswap = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export const InitCodeHashUniswap = "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";
export const FactoryFalcon = "0x896abe6a9be53df35edd7de5cdf791840bbbcfb9";
export const InitCodeHashFalcon = "0x3409348d384746f928895073695f4285138fd4c91ff63070662fba25a44f1688";
export const FactoryChiHang = "0xCa540466baAE470d7BF7EEdB0AF0671C8690babA";

///primary:

export const PrimaryFactoryAddress = FactoryChiHang;
export const PrimaryFactoryAbi = abiFactoryChiHang;

export const PrimaryRouteAddress = RouteChiHang;
export const PrimaryRouteAbi = abiRouteChiHang;

export const PrimaryPair = "";
export const PrimaryPairAbi = abiPairChiHang;
