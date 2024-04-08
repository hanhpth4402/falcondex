import {useState} from "react";
import {Web3} from "web3";
import {bigint} from "superstruct";

const useTimeStamp = () => {
    const [timeStamp, setTimeStamp] = useState<any>(null);
    const web3 = new Web3('https://mainnet.infura.io/v3/260b0922c2c94330b763aa93b5cacd7c');
    web3.eth.getBlock('latest').then((data) => {
        setTimeStamp(Number(data.timestamp)+60*20);
    });
    return `0x${(Number((Number(new Date())/1000).toFixed(0)) + 60*5).toString(16)}`;
};

export default useTimeStamp;
