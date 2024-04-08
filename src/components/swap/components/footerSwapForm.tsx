import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useState} from "react";
import BigNumber from "bignumber.js";
import {useSelector} from "react-redux";
import PlaceHolder from "@/assets/icons/placeHolder";

export interface Trade {
    Token0: string;
    Token1: string;
    Currency0Id: string;
    Currency1Id: string;
    Pair: {
        PairAddress: string;
        PairLoading: boolean;
    };
    DetailInfo: {
        Price: string;
        Reserves: string[];
        PriceImpact?: string;
        DetailLoading: boolean;
    }
    MinReceive?: string;
}
const FooterSwapForm: React.FC<{
    trade: Trade
}> = ({trade}) => {
    const [click, setClick] = useState(false);
    const changePrice = new BigNumber(new BigNumber(1).div(new BigNumber(trade.DetailInfo.Price))).toString(10);
    const slippageTolerance = useSelector((state: {swap: {slippageTolerance: number}}) => state.swap.slippageTolerance);
    return (
        <Container style={{color: 'white'}}>
            <Row>
                <Col xs={5}>Pair Address</Col>
                <Col xs={7}
                   style={{
                       maxWidth: "100%",
                       overflow: 'hidden',
                       textOverflow: 'ellipsis',
                       whiteSpace: 'nowrap'
                   }}
                >{trade.Pair.PairLoading ? <PlaceHolder xs={10}/> : `${trade.Pair.PairAddress}`}</Col>
            </Row>
            <Row>
                <Col xs={5}>Price</Col>
                <Col onClick={() => setClick((prev) => !prev)} xs={7}>{
                    click ? `1 ${trade.Token0} = ${trade.DetailInfo.Price} ${trade.Token1}` :
                        `1 ${trade.Token1} = ${changePrice} ${trade.Token0}`
                }</Col>
            </Row>
            <Row>
                <Col xs={5}>Slippage Tolerance</Col>
                <Col xs={7}>{slippageTolerance}</Col>
            </Row>
            <Row>
                <Col xs={5}>Price Impact</Col>
                <Col xs={7}>{trade.DetailInfo.PriceImpact}%</Col>
            </Row>
            <Row>
                <Col xs={5}>Minimum receive</Col>
                <Col xs={7}>{trade?.MinReceive || 0}</Col>
            </Row>
        </Container>
    )
}

export default FooterSwapForm;
