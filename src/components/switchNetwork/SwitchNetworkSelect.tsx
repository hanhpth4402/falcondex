import { Form } from "react-bootstrap"
import {useNetwork, useSwitchNetwork} from "wagmi";
import {switchNetwork} from "@wagmi/core";
import {useState} from "react";

const SwitchNetworkSelect = () => {
    const { chain } = useNetwork();
    const { chains } = useSwitchNetwork();
    const chainList: any = {
        "1": "Ethereum",
        "5": "Goerli",
        "11155111": "Sepolia"
    }
    console.log();
    const [chainId, setChainId] = useState("11155111");
    return (
        <Form.Select
            onChange={(event) => {
                const id = event.target.value;
                if (Number(id)) {
                    switchNetwork({
                        chainId: Number(id)
                    }).then((data) =>{
                        setChainId(`${data.id}`);
                    }).catch((data) => {
                        // console.log(data);
                    })
                }
            }}
            defaultValue={chainList[`${chainId}`]}
            suppressHydrationWarning
        >
            <option value="1">Ethereum</option>
            <option value="5">Goerli</option>
            <option value="11155111">Sepolia</option>
        </Form.Select>
    )
}

export default SwitchNetworkSelect;
