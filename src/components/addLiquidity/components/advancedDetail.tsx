import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Container} from "react-bootstrap";
import {AdvancedDetail} from "@/components/addLiquidity/useAddliquidity";
import {tokenList} from "@/config/tokenList";
import {useState} from "react";
import BigNumber from "bignumber.js";
import styles from "../Liquidity.module.scss";
import PlaceHolder from "@/assets/icons/placeHolder";

const AdvancedDetail: React.FC<AdvancedDetail> = (detailInformation) => {
    const {
        mintedLiquidity,
        poolTokenPercentage,
        price,
        pairAddress,
        tokens,
        reserves,
        pairLoading
    } = detailInformation;

    const tokenSymbol0 = tokenList.find((item) => item.address === tokens[0])?.symbol;
    const tokenSymbol1 = tokenList.find((item) => item.address === tokens[1])?.symbol;

    const [clicked, setClicked] = useState(false);
    const changePrice = new BigNumber(1).dividedBy(new BigNumber(price)).toFixed(10);
    const exactPrice = new BigNumber(price).toFixed(18);
    return (
        <Container className={'mb-3'} style={{minWidth: '500px'}}>
            <Col className={`${styles.LiquidityAdvancedDetail} w-100 p-3`}>
                <Row>
                    <Col xs={4}>LP Tokens Address</Col>
                    <Col xs={8} style={{
                        maxWidth: "100%",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>{pairLoading ? <PlaceHolder xs={10}/> : `${pairAddress}`}</Col>
                </Row>
                <Row>
                    <Col xs={4}>LP Tokens Received</Col>
                    <Col xs={8}>{mintedLiquidity}</Col>
                </Row>
                <Row>
                    <Col xs={4}>Price</Col>
                    <Col onClick={() => setClicked((prev) => !prev)} xs={8}>{
                        clicked ? `1 ${tokenSymbol0} = ${changePrice} ${tokenSymbol1}` :
                            `1 ${tokenSymbol1} = ${exactPrice} ${tokenSymbol0}`
                    }</Col>
                </Row>
                <Row>
                    <Col xs={4}>Your Pool Share</Col>
                    <Col xs={8}>{Number(poolTokenPercentage) === 0 ? `<0.01%` : `${poolTokenPercentage}%`}</Col>
                </Row>
            </Col>
            <Col className={`${styles.LiquidityAdvancedDetail} w-100 p-3 mt-3`}>
                <Row>
                    <Col xs={4}>Pooled {tokenSymbol0}</Col>
                    <Col xs={8}>{reserves[0]}</Col>
                    <Col xs={4}>Pooled {tokenSymbol1}</Col>
                    <Col xs={8}>{reserves[1]}</Col>
                </Row>
            </Col>
        </Container>
    )
}

export default AdvancedDetail;
