import {Container} from "react-bootstrap";
import {useChainId} from "wagmi";
import {useFarmInfo} from "@/components/yieldFarming/hooks/useFarmInfo";
import Token from "@/entities/token";
import {tokenList} from "@/config/tokenList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import styles from "../YieldFarming.module.scss";
import FarmStake from "@/components/yieldFarming/components/FarmStake";
import {useState} from "react";
import FarmHarvest from "@/components/yieldFarming/components/FarmHarvest";
import FarmWithdraw from "@/components/yieldFarming/components/FarmWithdraw";

const PoolTableHeader: React.FC = () => {
    return (
        <Container className={`${styles.FarmPoolHeader} pb-2`}>
            <Row>
                <Col>Pair</Col>
                <Col>Reward</Col>
                <Col>APR</Col>
                <Col>Duration</Col>
            </Row>
        </Container>
    )
}

const PoolInfo: React.FC<{
    contractAddress: string;
    rewardToken: Token;
    liquidityTokens: [Token, Token];
    stakeToken: Token;
    fee: number;
    duration: string;
    poolId: number;
}> = ({ contractAddress, rewardToken, liquidityTokens, stakeToken, fee, duration, poolId}) => {
    const [showAction, setShowAction] = useState<boolean>(false);

    return (
        <Container className={`${styles.FarmPoolHeader} py-3`}>
            <Row>
                <Col xs={3}>
                    <Row>
                        <Col xs={2} className="p-0" style={{
                            position: 'relative',
                            whiteSpace: 'nowrap',
                        }}>
                            {liquidityTokens[0]?.logoURI ? (
                                <Image width="30px"
                                       src={liquidityTokens[0].logoURI}
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
                            {liquidityTokens[1]?.logoURI ? (
                                <Image width="30px"
                                       src={liquidityTokens[1].logoURI}
                                       roundedCircle
                                       style={{ position: 'absolute', left: '20px' }}
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#D8D9DA"
                                     className="bi bi-question-circle" viewBox="0 0 16 16" style={{ position: 'absolute', left: '20px' }}>
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path
                                        d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                                </svg>
                            )}
                        </Col>
                        <Col xs={9}>{liquidityTokens[0]?.symbol}/{liquidityTokens[1]?.symbol}</Col>
                    </Row>
                </Col>

                <Col xs={3}>
                    {rewardToken?.logoURI ? (
                        <Image width="30px"
                               src={rewardToken.logoURI}
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
                    <span className="mx-2">{rewardToken.symbol}</span>
                </Col>

                <Col xs={3}>
                    APR: 5%
                </Col>

                <Col xs={2}>
                    {duration}
                </Col>

                <Col xs={1} onClick={() => setShowAction(!showAction)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </Col>
            </Row>

            {showAction && (
                <Row className="mt-3">
                    <FarmStake stakeToken={stakeToken} poolId={poolId} contract={contractAddress}/>
                    <FarmWithdraw stakeToken={stakeToken} poolId={poolId} contract={contractAddress}/>
                    <FarmHarvest rewardToken={rewardToken} stakeToken={stakeToken} poolId={poolId} contract={contractAddress} />
                </Row>
            )}
        </Container>
    )
}

const FarmPools: React.FC = () => {
    const chainId = useChainId();
    const allFarmPools = useFarmInfo(chainId, tokenList);

    return (
        <Container className={`${styles.FarmPool} w-100 my-3 py-3`}>
            <PoolTableHeader />
            {allFarmPools.map((pool, index) => (
                <PoolInfo
                    contractAddress={pool.contract}
                    key={`farm-pool-${index}`}
                    rewardToken={pool.rewardToken}
                    liquidityTokens={[pool.token0, pool.token1]}
                    stakeToken={pool.stakeToken}
                    fee={pool.fee}
                    duration={`${pool.timeLock}`}
                    poolId={pool.poolId}
                />
            ))}
        </Container>
    )
}

export default FarmPools;
