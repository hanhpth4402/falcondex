import TokenInput from "@/components/swap/tokenInput";
import {field} from "@/state/swap/actionSwap";
import Form from "react-bootstrap/Form";
import {useEffect, useMemo, useState} from "react";
import Button from "react-bootstrap/Button";
import {useAccount, useChainId, useProvider, useSigner, useTransaction} from "wagmi";
import {Contract} from "@ethersproject/contracts";
import {abiERC20} from "@/config/abi";
import BigNumber from "bignumber.js";
import Token from "@/entities/token";
import {tokenList} from "@/config/tokenList";
import stylesInput from "@/components/swap/TokenInput.module.scss";
import stylesSend from "@/components/swap/components/SwapComponents.module.scss";
import Row from "react-bootstrap/Row";
import useAmount from "@/components/addLiquidity/hooks/useAmount";
import SpinnerIcon from "@/assets/icons/spinnerIcon";
import useModal from "@/hooks/useModal";
import {SendErrorModal} from "@/components/swap/modal/sendErrorModal";
import {useBalance} from "@/hooks/useBalanceToken";
import {Transaction} from "@ethereumjs/tx";

const Send: React.FC = () => {
    const { isConnected, address} = useAccount();
    const chainId = useChainId();
    const provider = useProvider({chainId});
    const {data: signer} = useSigner();
    const signerOrProvider = signer ?? provider;

    const existTokenList = tokenList.filter((item) => item.chainId === chainId);

    const [amount, setAmount] = useState<string>('0');
    const [currentId, setCurrentId] = useState<`0x${string}`>(existTokenList[0].address);
    const [receipt, setReceipt] = useState<string>('');

    const handleSelectToken = (field: field, tokenId: `0x${string}`) => {
        setCurrentId(tokenId);
    }

    const handleChangeAmount = (field: field, value: string) => {
        setAmount(value);
    }

    const selectedToken = useMemo(() => {
        const allExistedTokens: Token[] = tokenList.filter((item) => (item?.chainId === chainId));
        const selectedToken0 = (currentId && allExistedTokens.find((token) => token.address.toLowerCase() === currentId.toLowerCase())) || allExistedTokens[0];
        return selectedToken0;
    }, [currentId]);


    const [attemptingTxn, setAttemptingTxn] = useState(false);
    const [hash, setHash] = useState<`0x${string}`>('0x0');
    const [newTxn, setNewTxn] = useState(false);
    const [balance, isLoading] = useBalance(selectedToken.address, address, signerOrProvider, hash, newTxn, setNewTxn);
    const [check, symbols]
        = useAmount([currentId, currentId], [balance, balance], [amount, amount]);

    const [onPresentMissingReceiveSendError] = useModal('Send failed', <SendErrorModal text={'Missing Receive Address'}/>)
    const [onPresentMissingAmountSendError] = useModal('Send failed', <SendErrorModal text={'Invalid Amount'}/>)
    const [onPresentCommonSendError] = useModal('Send failed', <SendErrorModal text={'Something Wrong'}/>)

    const handleSend = () => {
        const tokenContract = new Contract (currentId, abiERC20, signerOrProvider);
        console.log(selectedToken, currentId, selectedToken.address.toLowerCase(), currentId.toLowerCase());
        if (selectedToken && currentId && selectedToken.address.toLowerCase() === currentId.toLowerCase()) {
            const amountToSend = new BigNumber(
                (new BigNumber(amount).multipliedBy(10**Number(selectedToken.decimals)))
                    .toFixed(0)).toString(10);
            if (amountToSend !== '0') {
                if (receipt) {
                    setAttemptingTxn(true);
                    tokenContract.transfer(receipt, amountToSend).then((result: any) => {
                        setAttemptingTxn(false);
                        setHash(result.hash);
                        setNewTxn(true);
                    }).catch((error: any) => {
                        setAttemptingTxn(false);
                        onPresentCommonSendError();
                    });
                } else {
                    onPresentMissingReceiveSendError();
                }
            } else {
                onPresentMissingAmountSendError();
            }
        }
    }

    return (
        <Form>
            <fieldset style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
                <TokenInput
                    key="input"
                    tokenId={currentId}
                    value={amount}
                    setToken={handleSelectToken}
                    setValue={handleChangeAmount}
                    field={field.INPUT}
                    balance={new BigNumber(balance)}
                    inputStyle={{
                        height: '150px',
                        fontSize: '40px'
                    }}
                    isLoading={isLoading}
                />
                <Row className={stylesSend.SendReceiveHeader}>To Address</Row>
                <Form.Control
                    size="lg"
                    type="text"
                    onChange={(e) => {
                        if (e?.target?.value) setReceipt(e.target.value);
                        else setReceipt('');
                    }}
                    value={receipt}
                    className={stylesInput.ValueInput}
                />
            </fieldset>
            <Button
                onClick={() => {
                    handleSend();
                }}
                style={{
                    background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',
                    width: '100%',
                    margin: '8px 0'
                }}
                disabled={!isConnected || !check[0] || attemptingTxn}
            >
                {attemptingTxn ? <SpinnerIcon text={'Send'}/> : `Send ${selectedToken.symbol}`}
            </Button>
        </Form>
    )
}

export default Send;
