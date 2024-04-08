import {useContract, useContractRead, useProvider, useSigner} from "wagmi";
import {abiFactoryChiHang, abiRouteChiHang} from "@/config/abi";
import {FactoryChiHang, FactoryUniswap} from "@/config/configFactory";
import {Contract} from "@ethersproject/contracts";

const Test = () => {
    const {data: signer} = useSigner();
    const provider = useProvider({chainId: 11155111});
    const FactoryContract = new Contract(FactoryChiHang, abiFactoryChiHang, provider);

    const method = FactoryContract.getPair;
    const RBIFAddress = "0x2DAcbf2E82e5F78564DB1C5005bEC00A34DFBC6F";
    const ETHAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";

    const args = [RBIFAddress, ETHAddress];

    method(...args).then((data: any) => {
        console.log(data);
    }).then((err: any) => {
    });
    return <>
        <div>
            hanh
        </div>
    </>
};

export default Test;
