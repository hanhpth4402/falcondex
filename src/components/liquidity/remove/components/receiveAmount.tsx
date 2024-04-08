import {Container} from "react-bootstrap";
import {tokenList} from "@/config/tokenList";
import Image from 'react-bootstrap/Image';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const ReceiveAmount: React.FC<{amountPooledTokens: string[],
    pooledTokens: string[]}> = ({amountPooledTokens, pooledTokens}) => {
    const symbol0 = tokenList.find((item) => item.address === pooledTokens[0])?.symbol;
    const symbol1 = tokenList.find((item) => item.address === pooledTokens[1])?.symbol;

    const urlToken0 = tokenList.find((item) => item.address === pooledTokens[0])?.logoURI;
    const urlToken1 = tokenList.find((item) => item.address === pooledTokens[1])?.logoURI;
    return (
        <Container
            className={'d-flex row'}
            style={{
                color: '#D8D9DA',
                backgroundColor: '#1b1e29',
                borderRadius: 'var(--bs-border-radius-xl)',
                padding: '12px 0px',
                marginTop: '12px',
                minWidth: '500px'
            }}
        >
            <Row>
                <Col xs={7}>
                    {amountPooledTokens[0]}
                </Col>
                <Col>
                    <Image width={"30px"} src={urlToken0} roundedCircle />    {symbol0}
                </Col>
            </Row>

            <Row>
                <Col xs={7}>
                    {amountPooledTokens[1]}
                </Col>
                <Col>
                    <Image width={"30px"} src={urlToken1} roundedCircle />    {symbol1}
                </Col>
            </Row>
        </Container>
    )
}

export default ReceiveAmount;
