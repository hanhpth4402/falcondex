import {Container, Form} from "react-bootstrap";
import TokenInput from "@/components/swap/tokenInput";
import {useAccount, useChainId, useProvider, useSigner} from "wagmi";
import {useAddliquidity} from "@/components/addLiquidity/useAddliquidity";
import {field} from "@/state/swap/actionSwap";
import {useSelector} from "react-redux";
import useActionAddLiquidity from "@/state/addLiquidity/useActionAddLiquidity";
import {ApproveState, useApprove} from "@/components/addLiquidity/useApprove";
import {PrimaryRouteAddress} from "@/config/configFactory";
import Button from "react-bootstrap/Button";
import AdvancedDetail from "@/components/addLiquidity/components/advancedDetail";
import {useState} from "react";
import BigNumber from "bignumber.js";
import useAmount from "@/components/addLiquidity/hooks/useAmount";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useBalance} from "@/hooks/useBalanceToken";
import SpinnerIcon from "@/assets/icons/spinnerIcon";

const AddLiquidity = () => {
    const [slippageTolerance, setSlippageTolerance] = useState(0);
    const {address} = useAccount();
    const chainId = useChainId();

    const {data: signer} = useSigner();
    const provider = useProvider({chainId});
    const signerOrProvider = signer ?? provider;

    const [attemptingTxn, setAttemptingTxn] = useState(false);
    const [hash, setHash] = useState<`0x${string}`>('0x0');
    const [newTxn0, setNewTxn0] = useState(false);
    const [newTxn1, setNewTxn1] = useState(false);

    const {
        independentField,
        [field.INPUT]: {
            currencyId: tokenIn,
            value: valueIn
        },
        [field.OUTPUT]: {
            currencyId: tokenOut,
            value: valueOut
        },
    } = useSelector((state: {addLiquidity: any}) => state.addLiquidity);

    const {handleSelectToken, handleChangeAmount} = useActionAddLiquidity();
    const [formatted, callBackAddLiquidity, advanceDetail] = useAddliquidity(
        signerOrProvider,
        chainId,
        slippageTolerance,
        setAttemptingTxn,
        setHash,
        setNewTxn0,
        setNewTxn1
    );

    const [approveState0, approveFunc0] = useApprove(tokenIn, Number(formatted[0]), address || "0x0", PrimaryRouteAddress, signerOrProvider);
    const [approveState1, approveFunc1] = useApprove(tokenOut, Number(formatted[1]), address || "0x0", PrimaryRouteAddress, signerOrProvider);

    const [balance0, isLoading0] = useBalance(tokenIn, address, signerOrProvider, hash, newTxn0, setNewTxn0);
    const [balance1, isLoading1] = useBalance(tokenOut, address, signerOrProvider, hash, newTxn1, setNewTxn1);
    const [check, symbols]
        = useAmount([tokenIn, tokenOut], [balance0, balance1], formatted);

    console.log(valueIn, valueOut, formatted);

    return (
        <Row className={'d-flex col'}>
            <Col>
                <Container style={{minWidth: '500px'}}>
                    <Col className="mb-3 w-100" controlId="formBasicEmail">
                        <TokenInput
                            key="token0"
                            value={independentField === field.INPUT ? valueIn : formatted[0]}
                            tokenId={tokenIn || `0x0`}
                            setToken={handleSelectToken}
                            setValue={handleChangeAmount}
                            field={field.INPUT}
                            balance={new BigNumber(balance0)}
                            isLoading={isLoading0}
                        />
                    </Col>

                    <Col className="mb-3 w-100" controlId="formBasicPassword">
                        <TokenInput
                            key="token1"
                            value={independentField === field.OUTPUT ? valueOut : formatted[1]}
                            tokenId={tokenOut || `0x0`}
                            setToken={handleSelectToken}
                            setValue={handleChangeAmount}
                            field={field.OUTPUT}
                            balance={new BigNumber(balance1)}
                            isLoading={isLoading1}
                        />
                    </Col>
                    <Col className={'w-100'}>
                        {
                            approveState0 === ApproveState.APPROVED && approveState1 === ApproveState.APPROVED &&
                            <Button
                                onClick={callBackAddLiquidity}
                                disabled={Number(formatted[0])<=0 || Number(formatted[1])<=0 || !check[0] || !check[1] || attemptingTxn}
                                style={{
                                    background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',
                                }}
                                className="w-100 mb-3"
                            >
                                {check[0] && check[1] ?
                                    (attemptingTxn ? <SpinnerIcon text={'Supply'}/> : `Supply`) :
                                    `Not enough ${!check[0] ? symbols[0] : ''} ${!check[1] ? symbols[1] : ''} to add liquidity`}
                            </Button>
                        }
                        {
                            approveState0 === ApproveState.NOT_APPROVED &&
                            <Button
                                onClick={approveFunc0}
                                disabled={!check[0]}
                                style={{
                                    background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',
                                }}
                                className="w-100 mb-3"
                            >
                                {check[0] ? `Approve ${symbols[0]}` : `Not enough ${symbols[0]} to approve`}
                            </Button>
                        }
                        {
                            approveState1 === ApproveState.NOT_APPROVED &&
                            <Button
                                onClick={approveFunc1}
                                disabled={!check[1]}
                                style={{
                                    background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',
                                }}
                                className="w-100 mb-3"
                            >
                                {check[1] ? `Approve ${symbols[1]}` : `Not enough ${symbols[1]} to approve`}
                            </Button>
                        }
                    </Col>
                </Container>
            </Col>
            <Col>
                <AdvancedDetail {...advanceDetail}/>
            </Col>
        </Row>
    )
}

export default AddLiquidity;
