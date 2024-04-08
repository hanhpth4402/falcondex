import Form from "react-bootstrap/Form";
import TokenInput from "@/components/swap/tokenInput";
import {field} from "@/state/swap/actionSwap";
import ShuffleIcon from "@/assets/icons/shuffleIcon";
import {ApproveState, useApprove} from "@/components/addLiquidity/useApprove";
import Button from "react-bootstrap/Button";
import FooterSwapForm from "@/components/swap/components/footerSwapForm";
import {useAccount, useChainId, useProvider, useSigner} from "wagmi";
import useActionSwap from "@/state/swap/useActionSwap";
import {useEffect, useMemo, useState} from "react";
import {RouteChiHang, RouteUniswap} from "@/config/configRoute";
import {useSelector} from "react-redux";
import useSwapType0 from "@/components/swap/useSwapType0";
import {abiERC20, abiRouteChiHang} from "@/config/abi";

import BigNumber from "bignumber.js";
import useAmount from "@/components/addLiquidity/hooks/useAmount";
import useSimpleToast from "@/assets/icons/toast";
import SpinnerIcon from "@/assets/icons/spinnerIcon";
import {tokenList} from "@/config/tokenList";
import {useBalance} from "@/hooks/useBalanceToken";

const Swap: React.FC = () => {
    const chainId = useChainId();
    const {address, isConnected} = useAccount();
    const provider = useProvider({chainId});
    const {data: signer} = useSigner();
    const signerOrProvider = signer ?? provider;
    const {handleSwitchCurrency} = useActionSwap();

    const validTokenList = tokenList.filter((item) => item.chainId === chainId);

    const [attemptingTxn, setAttemptingTxn] = useState(false);

    const routeAddress = useMemo (() => (
        chainId === 1 ? RouteUniswap : RouteChiHang
    ), [chainId]);
    const {
        independentField,
        value,
        [field.INPUT]: {
            currencyId: currencyId0
        },
        [field.OUTPUT]: {
            currencyId: currencyId1
        },
        slippageTolerance,
    } = useSelector((state: {swap: any}) => state.swap);

    const [approveState, approveHandle, attemptingTxnApprove] = useApprove(
        currencyId0,
        Number(value),
        address || '0x0',
        routeAddress,
        signerOrProvider
    )
    const {handleSelectToken, handleChangeAmount} = useActionSwap();

    const switchToken = () => {
        handleSwitchCurrency(amounts?.[1] || value);
    }

    const [hash, setHash] = useState<`0x${string}`>('0x0');
    const [newTxn0, setNewTxn0] = useState(false);
    const [newTxn1, setNewTxn1] = useState(false);

    const [trade, amounts, mininumExpectAmountOut, handleSwap] = useSwapType0(
        address || '0x0',
        routeAddress,
        abiRouteChiHang,
        signerOrProvider,
        currencyId0,
        currencyId1,
        value,
        independentField,
        slippageTolerance,
        setAttemptingTxn,
        setHash,
        setNewTxn0,
        setNewTxn1,
    );

    const [balance0, isLoading0] = useBalance(
        currencyId0 || validTokenList[0].address,
        address,
        signerOrProvider,
        hash,
        newTxn0,
        setNewTxn0,
        )
    const [balance1, isLoading1] = useBalance(
        currencyId1 || validTokenList[1].address,
        address,
        signerOrProvider,
        hash,
        newTxn1,
        setNewTxn1
    );
    const [ check, symbols]
        = useAmount([currencyId0 || validTokenList[0].address, currencyId1 || validTokenList[1].address],
        [balance0, balance1], amounts);
    return (
        <Form className="w-100">
            <fieldset style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
                <TokenInput
                    key="input"
                    tokenId={currencyId0 || validTokenList[0].address}
                    value={independentField === field.INPUT ? value : amounts?.[0]}
                    setToken={handleSelectToken}
                    setValue={handleChangeAmount}
                    field={field.INPUT}
                    balance={new BigNumber(balance0)}
                    isLoading={isLoading0}
                />
                <div
                    onClick={switchToken}
                    style={{
                        padding: '4px',
                        backgroundColor: '#2f323d',
                        position: 'absolute',
                        top: '145px',
                        borderRadius: 'var(--bs-border-radius-sm)'
                    }}
                >
                    <ShuffleIcon />
                </div>
                <TokenInput
                    key="output"
                    tokenId={currencyId1 || validTokenList[1].address}
                    value={independentField === field.OUTPUT ? value : amounts?.[1]}
                    setToken={handleSelectToken}
                    setValue={handleChangeAmount}
                    field={field.OUTPUT}
                    balance={new BigNumber(balance1)}
                    isLoading={isLoading1}
                />
            </fieldset>
                {
                    check[0] && approveState === ApproveState.NOT_APPROVED &&
                    <Button
                        onClick={() => {
                            approveHandle();
                        }}
                        style={{
                            background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',
                            margin: '8px 0'
                        }}
                        className="w-100"
                        disabled={attemptingTxnApprove}
                    >
                        {attemptingTxnApprove ? <SpinnerIcon text={'Approve'}/> : 'Approve'}
                    </Button>
                }
                {
                    (!check[0] || approveState === ApproveState.APPROVED) &&
                    <Button
                        onClick={() => {
                            handleSwap();
                        }}
                        style={{
                            background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)',
                            margin: '8px 0'
                        }}
                        disabled={!isConnected || !check[0] || attemptingTxn}
                        className="w-100"
                    >
                            {check[0] ? (attemptingTxn ? <SpinnerIcon text={'Swap'}/> : 'Swap') :
                                `Not enough ${check[0] ? '' : symbols[0]} to swap`}
                    </Button>
                }
            <FooterSwapForm trade={{...trade, MinReceive: mininumExpectAmountOut}}/>
        </Form>
    )
}

export default Swap;
