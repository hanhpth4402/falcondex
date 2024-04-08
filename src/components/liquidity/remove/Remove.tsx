import {Container} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import useUserPosition from "@/components/liquidity/remove/hooks/useUserPosition";
import {useAccount, useProvider, useSigner} from "wagmi";
import ReceiveAmount from "@/components/liquidity/remove/components/receiveAmount";
import BigNumber from "bignumber.js";
import UserPosition from "@/components/liquidity/remove/components/userPosition";
import useRemoveLiquidity from "@/components/liquidity/remove/hooks/useRemoveLiquidity";
import Button from "react-bootstrap/Button";
import {ApproveState, useApprove} from "@/components/addLiquidity/useApprove";
import {PrimaryRouteAddress} from "@/config/configFactory";
import RemoveAmount from "@/components/liquidity/remove/components/removeAmount";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ArrowDown from "@/assets/icons/arrowDown";
import SpinnerIcon from "@/assets/icons/spinnerIcon";

const Remove: React.FC<{slippageTolerance?: number}> = () => {
    const {address} = useAccount();
    const [token0, setToken0] = useState("0x2DAcbf2E82e5F78564DB1C5005bEC00A34DFBC6F");
    const [token1, setToken1] = useState("0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9");

    const {data: signer} = useSigner();
    const provider = useProvider({chainId: 11155111});
    const signerOrProvider = signer ?? provider;
    const [attemptingTxn, setAttemptingTxn] = useState(false);

    const {
        pairAddress,
        totalSupply,
        res,
        userPosition,
        balance,
        decimal,
        isFetching
    } = useUserPosition(address || "0x0", token0, token1, signerOrProvider);

    const isPooledPair = useMemo(() => {
        return pairAddress !== '0x0000000000000000000000000000000000000000' && pairAddress !== '0x0'
    }, [pairAddress])


    const [state, setState] = useState(0);
    const [receiveAmounts, setReceiveAmounts] = useState(['0', '0']);
    const handleChangeState = (value: number) => {
        setState(value);
    };

    useEffect(() => {
        const _amount0 = new BigNumber(userPosition[0]).multipliedBy(state).div(100);
        const _amount1 = new BigNumber(userPosition[1]).multipliedBy(state).div(100);
        setReceiveAmounts([_amount0.toString(10), _amount1.toString(10)]);
    }, [userPosition, state])

    const liquidityAmount = useMemo(() => (
        new BigNumber(balance).multipliedBy(state).div(100).toString(10)
    ), [state, balance]);

    const removeLiquidity = useRemoveLiquidity({
        token0,
        token1,
        personalLiquidity: balance,
        totalLiquidity: totalSupply,
        range: state,
        res,
        lpTokenDecimal: decimal,
        addressTo: address || "0x0",
        signerOrProvider,
        setAttemptingTxn
    });

    const [approveState, approveFunction, attemptingApproveTxn] = useApprove(pairAddress, Number(liquidityAmount), address || '0x0', PrimaryRouteAddress, signerOrProvider, decimal);

    return (
        <Row className={'d-flex col'} style={{marginLeft: '12px'}}>
            <Col>
                <UserPosition
                    liquidity={balance}
                    totalSupply={totalSupply}
                    amountPooledTokens={userPosition}
                    tokens={[token0, token1]}
                    setToken0={setToken0}
                    setToken1={setToken1}
                />
            </Col>
            <Col>
                <RemoveAmount state={state} handleChangeState={handleChangeState} liquidityAmount={liquidityAmount} />
                <div className={'d-flex col'} style={{marginTop: '12px', minWidth: '500px'}}>
                    <ArrowDown style={{margin: 'auto'}} width={"25px"} fill={'#D8D9DA'}/>
                </div>
                <ReceiveAmount amountPooledTokens={receiveAmounts} pooledTokens={[token0, token1]}/>
                <Container
                    className={'d-flex row'}
                    style={{
                        borderRadius: 'var(--bs-border-radius-xl)',
                        padding: '0px 0px',
                        marginTop: '12px',
                        minWidth: '500px'
                    }}
                >
                    {approveState === ApproveState.NOT_APPROVED || !isPooledPair ?
                    <Button
                        style={{
                            background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',

                        }}
                        className="w-100 mb-3"
                        onClick = {approveFunction}
                        disabled = {state === 0 || !isPooledPair || liquidityAmount === '0' || attemptingApproveTxn}
                    >
                        {attemptingApproveTxn ? <SpinnerIcon text={'Approve'}/> : `Approve Liquidity`}
                    </Button> :
                    <Button
                        style={{
                            background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',

                        }}
                        className="w-100 mb-3"
                        onClick={() => {
                            if (removeLiquidity) {
                                removeLiquidity();
                            }
                        }}
                        disabled = {state === 0 || !isPooledPair || liquidityAmount === '0' || attemptingTxn}
                    >
                        {attemptingTxn ? <SpinnerIcon text={'Remove'}/> : 'Remove Liquidity'}
                    </Button>}
                </Container>
            </Col>
        </Row>
    )
}

export default Remove;
