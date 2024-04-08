import {Container, Spinner} from "react-bootstrap";
import Token from "@/entities/token";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../YieldFarming.module.scss";
import inputStyles from "@/components/swap/TokenInput.module.scss";
import Image from "react-bootstrap/Image";
import useBalanceToken, {useBalance} from "@/hooks/useBalanceToken";
import useToken from "@/hooks/useToken";
import {useCallback, useEffect, useMemo, useState} from "react";
import BigNumber from "bignumber.js";
import useStake from "@/components/yieldFarming/hooks/useStake";
import {ApproveState, useApprove} from "@/components/addLiquidity/useApprove";
import {useAccount, useChainId, useProvider, useSigner} from "wagmi";
import SpinnerIcon from "@/assets/icons/spinnerIcon";
import PlaceHolder from "@/assets/icons/placeHolder";

const FarmStake: React.FC<{
    stakeToken: Token;
    poolId: number;
    contract: string;
}> = ({ stakeToken, poolId , contract}) => {
    const farmAddress = contract; /// hard code

    const chainId = useChainId();
    const {data: signer} = useSigner();
    const provider = useProvider({chainId});
    const signerOrProvider = signer ?? provider;

    const [amount, setAmount] = useState('0');
    const lpToken = useToken(stakeToken.address);
    const {address} = useAccount();
    const [balanceToken, loading] = useBalance(stakeToken.address, address, signerOrProvider);

    const handleSetAmountStake = useCallback((value: string) => {
        setAmount(value);
    }, [lpToken]);

    const validAmount = useMemo(() => {
        const _amount = BigNumber(amount);
        const _balance = BigNumber(balanceToken);
        return !(_amount.comparedTo(0) <= 0) && _balance.comparedTo(_amount) === 1;
    }, [amount, balanceToken])

    const [approveState, approveFunction] = useApprove(stakeToken.address,
        Number(amount), address || '0x0', farmAddress, signerOrProvider);

    const [attemptingTxn, setAttemptingTxn] = useState(false);
    const [hash, setHash] = useState('');

    const handleStake = useStake({poolId, amount, farmAddress: contract, setAttemptingTxn, setHash});

    return (
        <Container className={`${styles.FarmAction} p-3`} style={{minWidth: '290px'}}>
            <Col className="mb-2 w-100">My Liquidity Balance:</Col>
            <Col className="mb-1 w-100">
                <Row>
                    <Col xs={1} style={{marginRight: "10px"}}>
                        {stakeToken?.logoURI ? (
                            <Image width="30px"
                                   src={stakeToken.logoURI}
                                   roundedCircle
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#D8D9DA"
                                 className="bi bi-question-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path
                                    d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                            </svg>
                        )}
                    </Col>
                    <Col xs={4} style={{
                        maxWidth: "100%",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>{stakeToken.symbol}</Col>
                    <Col xs={6} style={{
                        maxWidth: "100%",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>{loading ? <PlaceHolder xs={10}/> : `${balanceToken}`}</Col>
                </Row>
            </Col>
            <Col className="mb-1 w-100">Get more LP token</Col>
            <Col className="mb-1 w-100">
                <Form.Control
                    size="sm"
                    type="number"
                    onChange={(e) => {
                        if (e?.target?.value) {
                            const new_value = Number(e.target.value);
                            if (new_value < 0) {
                                setAmount(new_value.toString());
                            } else {
                                handleSetAmountStake(e.target.value.replace(/[^\d\.]*/g, ''));
                            }
                        }
                        else {
                            handleSetAmountStake('0');
                        }
                    }}
                    className={inputStyles.ValueInput}
                />
            </Col>
            <Col className={'w-100'}>
                {approveState === ApproveState.APPROVED && <Button
                    style={{background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)'}}
                    className="w-100"
                    onClick={handleStake}
                    disabled={!validAmount || attemptingTxn}
                >
                    {attemptingTxn ?
                        <SpinnerIcon text={'Stake'}/> :
                        `${validAmount ? 'Stake' : 'Invalid amount to stake'}`
                    }
                </Button>}
                {
                    approveState === ApproveState.NOT_APPROVED &&  <Button
                        style={{background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)'}}
                        className="w-100"
                        onClick={approveFunction}
                        disabled={!validAmount}
                    >
                        {validAmount ? 'Approve' : 'Invalid amount to approve'}
                    </Button>
                }
            </Col>
        </Container>
    )
}

export default FarmStake;
