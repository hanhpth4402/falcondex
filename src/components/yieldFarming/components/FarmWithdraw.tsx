import {Container} from "react-bootstrap";
import styles from "@/components/yieldFarming/YieldFarming.module.scss";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Token from "@/entities/token";
import {useUserInfo, useWithdraw} from "@/components/yieldFarming/hooks/useWithdraw";
import {useAccount, useChainId, useProvider, useSigner} from "wagmi";
import {Contract} from "@ethersproject/contracts";
import {HanhFarmAbi1} from "@/config/configHanhFarm";
import useToken from "@/hooks/useToken";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import SpinnerIcon from "@/assets/icons/spinnerIcon";
import PlaceHolder from "@/assets/icons/placeHolder";

const FarmWithdraw: React.FC<{
    stakeToken: Token,
    poolId: number,
    contract: string
}> = ({stakeToken, poolId, contract}) => {
    const {address} = useAccount();
    const chainId = useChainId();
    const {data: signer} = useSigner();
    const provider = useProvider({chainId});
    const signerOrProvider = signer ?? provider;

    const farmContract = new Contract(contract, HanhFarmAbi1, signerOrProvider);
    const [userInfo, loading] = useUserInfo(farmContract, poolId, address || '0x0', stakeToken);

    const [attemptingTxn, setAttemptingTxn] = useState(false);
    const [hash, setHash] = useState('');
    const [withdrawFunc] = useWithdraw(farmContract, poolId, setAttemptingTxn, setHash);
    return (
        <Container className={`${styles.FarmAction} p-3`} style={{minWidth: '290px'}}>
            <Col className="mb-2 w-100">My LP Staked:</Col>
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
                        whiteSpace: 'nowrap'
                    }}>{loading ? <PlaceHolder xs={10}/> : userInfo.amount}</Col>
                </Row>
            </Col>
            <Col>
                <Button
                    style={{ background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)' }}
                    className="w-100"
                    onClick={withdrawFunc}
                    disabled={attemptingTxn}
                >
                    { attemptingTxn ? <SpinnerIcon text={'Withdraw'}/> : 'Withdraw' }
                </Button>
            </Col>
        </Container>
    )
}
export default FarmWithdraw;
