import {Container} from "react-bootstrap";
import {tokenList} from "@/config/tokenList";
import BigNumber from "bignumber.js";
import Image from "react-bootstrap/Image";
import TokenSelector from "@/components/tokenSelect/TokenSelector";
import Token from "@/entities/token";
import {useChainId} from "wagmi";
import {useMemo} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UserPosition: React.FC<{
    liquidity: string,
    totalSupply: string,
    amountPooledTokens: string[],
    tokens: string[],
    setToken0: (address: string) => void,
    setToken1: (address: string) => void,
}> = ({
    liquidity,
    totalSupply,
    amountPooledTokens,
    tokens,
    setToken0,
    setToken1
}) => {
    const symbol0 = tokenList.find((item) => item.address === tokens[0])?.symbol;
    const symbol1 = tokenList.find((item) => item.address === tokens[1])?.symbol;

    const urlToken0 = tokenList.find((item) => item.address === tokens[0])?.logoURI;
    const urlToken1 = tokenList.find((item) => item.address === tokens[1])?.logoURI;

    const share = useMemo(() => (
        (new BigNumber(totalSupply).isEqualTo(0) ?
                new BigNumber(0).toString(10) :
                new BigNumber(liquidity).div(new BigNumber(totalSupply)).multipliedBy(100).toFixed(4)
        )
    ), [liquidity, totalSupply]);

    const chainId = useChainId();
    const allExistedTokens: Token[] = tokenList.filter((item) => (item?.chainId === chainId));

    const selectedToken0 = (tokens[0] && allExistedTokens.find((token) => token.address.toLowerCase() === tokens[0].toLowerCase())) || allExistedTokens[0];
    const handleSetToken0 = (address: `0x${string}`) => {
        setToken0(address);
    }

    const selectedToken1 = (tokens[1] && allExistedTokens.find((token) => token.address.toLowerCase() === tokens[1].toLowerCase())) || allExistedTokens[1];
    const handleSetToken1 = (address: `0x${string}`) => {
        setToken1(address);
    }

    return (
        <Container
            className={'d-flex row'}
            style={{
                color: '#D8D9DA',
                backgroundColor: '#1b1e29',
                borderRadius: 'var(--bs-border-radius-xl)',
                paddingTop: '12px',
                marginBottom: '20px',
                minWidth: '500px'
            }}
        >
            <div className={'d-flex'} style={{padding: '0px', margin: '0px', width:'250px'}}>
                <TokenSelector
                    selectedToken={selectedToken0}
                    allTokens={allExistedTokens}
                    selectToken={handleSetToken0}
                />
                <TokenSelector
                    selectedToken={selectedToken1}
                    allTokens={allExistedTokens}
                    selectToken={handleSetToken1}
                />
            </div>
            <Container
                className={'d-flex justify-content-between'}
                style={{
                    backgroundColor: '#252833',
                    borderRadius: 'var(--bs-border-radius-xl)',
                    padding: '12px 0px',
                    marginTop: '20px'
                }}
            >
                <Col xs={6} style={{
                    margin: "0px",
                    padding: '0px 12px',
                    position: 'relative',
                    display: 'flex'
                }}>
                    <Image style={{
                        width: "30px",
                        height: "30px",
                    }} src={urlToken0} roundedCircle />
                    <Image style={{
                        width: "30px",
                        height: "30px",
                        position: 'absolute',
                        left: '32px'}} src={urlToken1} roundedCircle />
                    <p style={{
                        padding: '0px',
                        margin: '0px',
                        marginLeft: '30px'
                    }}>
                        {symbol0} - {symbol1}
                    </p>
                </Col>
                <Col style={{
                    margin: "0px",
                    padding: '0px 12px'
                }}>
                    {liquidity}
                </Col>
            </Container>
            <Container
                style={{
                    backgroundColor: '#252833',
                    borderRadius: 'var(--bs-border-radius-xl)',
                    margin: '20px 0px',
                    padding: '12px'
                }}
            >
                <Row className={'d-flex justify-content-between'}>
                    <Col xs={6} style={{
                        margin: "0px",
                    }}>
                        Your pool share
                    </Col>
                    <Col>
                        {Number(share) === 0 ? `<0.0001%` : `${share}%`}
                    </Col>
                </Row>
                <Row className={'d-flex justify-content-between'}>
                    <Col xs={6} style={{
                        margin: "0px",
                    }}>
                        Pooled {symbol0}
                    </Col>
                    <Col xs={6} style={{
                        maxWidth: "100%",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {amountPooledTokens[0]}
                    </Col>
                </Row>
                <Row className={'d-flex justify-content-between'}>
                    <Col xs={6} style={{
                        margin: "0px",
                    }}>
                        Pooled {symbol1}
                    </Col>
                    <Col xs={6}>
                        {amountPooledTokens[1]}
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default UserPosition;
