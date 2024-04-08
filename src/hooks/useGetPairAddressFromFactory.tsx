'use client'
import {Contract} from "@ethersproject/contracts";
import {useEffect, useState} from "react";

const useGetPairAddressFromFactory = (
    token0: string,
    token1: string,
    factoryAddress: string,
    factoryAbi: any,
    signerOrProvider: any,
) => {
    const factoryContract = new Contract(factoryAddress, factoryAbi, signerOrProvider);
    const methodGetPair = factoryContract.getPair;
    methodGetPair(token0, token1).then((data: any) => {
        console.log('pair', data);
    }).catch((err: any) => {
        console.log(err)
    })

}

export default useGetPairAddressFromFactory;
