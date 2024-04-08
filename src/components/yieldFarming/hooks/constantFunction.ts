import {Contract} from "@ethersproject/contracts";

const getValue  = async (contract: Contract, method: string, args: any[]): Promise<any> => {
    let result;
    try {
        result = await contract.functions[method](...args);
    } catch (e) {
        return getValue(contract, method, args);
    }
    return result;
}
export default getValue;
