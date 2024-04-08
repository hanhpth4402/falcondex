import {Container} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Token from "@/entities/token";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import {field} from "@/state/swap/actionSwap";
import {useSelector} from "react-redux";
import {Contract} from "@ethersproject/contracts";
import {FactoryChiHang} from "@/config/configFactory";
import {abiFactoryChiHang} from "@/config/abi";
import {useChainId, useProvider} from "wagmi";
import {tokenList} from "@/config/tokenList";
import {useEffect, useState} from "react";
import styles from '@/assets/styles/PoolList.module.scss';

const PoolInfo: React.FC<{
    token0?: Token;
    token1?: Token;
}> = ({ token0, token1 }) => {
    return (
        <Container style={{ padding: '12px' }} className={styles.PoolInfo}>
            <Row>
                <Col xs={3} style={{ position: 'relative' }}>
                    {token0?.logoURI ? (
                        <Image width="30px"
                               src={token0.logoURI}
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
                    {token1?.logoURI ? (
                        <Image width="30px"
                               src={token1.logoURI}
                               roundedCircle
                               style={{ position: 'absolute', left: '30px' }}
                        />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#D8D9DA"
                             className="bi bi-question-circle" viewBox="0 0 16 16" style={{ position: 'absolute', left: '30px' }}>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path
                                d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                        </svg>
                    )}
                </Col>

                <Col xs={9} style={{color: '#D8D9DA' }}>{token0?.symbol}/{token1?.symbol}</Col>
            </Row>
        </Container>
    )
}

const PoolList: React.FC = () => {
    const {
        [field.INPUT]: {
            currencyId: currencyId0
        },
        [field.OUTPUT]: {
            currencyId: currencyId1
        },
    } = useSelector((state: {swap: any}) => state.swap);

    const chainId = useChainId();
    const provider = useProvider({ chainId });
    const FactoryContract = new Contract(FactoryChiHang, abiFactoryChiHang, provider);

    const allExistedTokens: Token[] = tokenList.filter((item) => {
        return (item?.chainId === chainId) && !(
            item?.address.toLowerCase() === currencyId0?.toLowerCase()
            || item?.address.toLowerCase() === currencyId1?.toLowerCase()
        );
    });

    const selectedToken0 = (currencyId0 && tokenList.find((token) => token.address.toLowerCase() === currencyId0.toLowerCase())) || tokenList[0];
    const selectedToken1 = (currencyId1 && tokenList.find((token) => token.address.toLowerCase() === currencyId1.toLowerCase())) || tokenList[0];

    const [pairsWithToken0, setPairsWithToken0] = useState<{ pairAddress: string, token0: Token, token1: Token }[]>();
    const [pairsWithToken1, setPairsWithToken1] = useState<{ pairAddress: string, token0: Token, token1: Token }[]>();
    const [pairSelectedTokens, setPairSelectedTokens] = useState<{ pairAddress: string, token0: Token, token1: Token }>();

    useEffect(() => {
        if (selectedToken0?.address) {
            Promise.all(allExistedTokens
                .map((token) => {
                    return FactoryContract.getPair(selectedToken0.address, token.address)
                })
            ).then((result) => {
                setPairsWithToken0(
                    allExistedTokens.map((token, index) => ({
                        pairAddress: result[index],
                        token0: selectedToken0,
                        token1: token
                    })).filter((pair) => pair.pairAddress.toLowerCase() !== '0x0000000000000000000000000000000000000000'.toLowerCase())
                )
            }).catch((error) => {});
        }
    }, [selectedToken0, allExistedTokens]);

    useEffect(() => {
        if (selectedToken1.address) {
            Promise.all(allExistedTokens
                .map((token) => {
                    return FactoryContract.getPair(selectedToken1.address, token.address)
                })
            ).then((result) => {
                setPairsWithToken1(
                    allExistedTokens.map((token, index) => ({
                        pairAddress: result[index],
                        token0: selectedToken1,
                        token1: token
                    })).filter((pair) => pair.pairAddress.toLowerCase() !== '0x0000000000000000000000000000000000000000'.toLowerCase())
                )
            }).catch((error) => {});
        }
    }, [selectedToken1, allExistedTokens]);

    useEffect(() => {
        if (selectedToken0?.address && selectedToken1?.address && selectedToken0?.address?.toLowerCase() !== selectedToken1?.address?.toLowerCase()) {
            FactoryContract.getPair(selectedToken0.address, selectedToken1.address).then((pairAddress: string) => {
                setPairSelectedTokens({
                    pairAddress,
                    token0: selectedToken0,
                    token1: selectedToken1,
                })
            }).catch(() => {})
        }
    }, [selectedToken0, selectedToken1]);

    return (
        <Container className={styles.PoolListContainer}>
            <Col style={{color: '#D8D9DA', fontWeight: '600', marginBottom: '20px' }}>Liquidity Pools</Col>

            <Col>
                {pairsWithToken0 && pairsWithToken0.map((pair, index) => (
                    <PoolInfo
                        key={`pool-info-token-0-${index}`}
                        token0={pair.token0}
                        token1={pair.token1}
                    />
                ))}
                {pairsWithToken1 && pairsWithToken1.map((pair, index) => (
                    <PoolInfo
                        key={`pool-info-token-1-${index}`}
                        token0={pair.token0}
                        token1={pair.token1}
                    />
                ))}
                {pairSelectedTokens && (
                    <PoolInfo
                        key={`pool-info-selected-tokens`}
                        token0={pairSelectedTokens.token0}
                        token1={pairSelectedTokens.token1}
                    />
                )}
            </Col>
        </Container>
    )
}

export default PoolList;