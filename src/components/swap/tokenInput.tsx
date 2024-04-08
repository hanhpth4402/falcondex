import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Card, Container} from "react-bootstrap";
import {useChainId} from "wagmi";
import TokenSelector from "@/components/tokenSelect/TokenSelector";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Token from "@/entities/token";
import {tokenList} from "@/config/tokenList";
import {field} from "@/state/swap/actionSwap";
import BigNumber from "bignumber.js";
import styles from './TokenInput.module.scss';
import PlaceHolder from "@/assets/icons/placeHolder";

const percent = [0.25, 0.5, 0.75, 1];
const TokenInput: React.FC<{
    tokenId: string;
    value: any;
    setToken: (field: field, currencyId: `0x${string}`) => void;
    setValue: (field: field, value: string) => void;
    field: field,
    inputStyle?: any;
    balance: BigNumber;
    isLoading?: boolean;
}> = ({ tokenId, value, setToken, setValue, field, inputStyle, balance, isLoading}) => {
    const chainId = useChainId();
    const allExistedTokens: Token[] = tokenList.filter((item) => (item?.chainId === chainId));
    const selectedToken = (tokenId && allExistedTokens.find((token) => token.address.toLowerCase() === tokenId.toLowerCase())) || allExistedTokens[0];

    const tokenBalanceOfAccount = new BigNumber(balance.toString(10));
    const handleSetToken = (tokenAddress: `0x${string}`) => {
        setToken(field, tokenAddress);
    }

    const handleSetValue = (value: string) => {
        setValue(field, value);
    }

    return (
        <Container className={styles.TokenInputContainer}>
            <Container>
                <Row style={{ alignItems: 'center' }}>
                    <Col xs={2} style={{ padding: 0 }}>
                        <TokenSelector
                            selectedToken={selectedToken}
                            allTokens={allExistedTokens}
                            selectToken={handleSetToken}
                        />
                    </Col>
                    <Col xs={6}></Col>
                    <Col xs={4} style={{ padding: 0 }}>
                        <Container>
                            <Row>
                                <Col xs={4} style={{ padding: 0 }}>
                                    <Card.Text>Balance</Card.Text>
                                </Col>
                                {
                                    isLoading ?
                                    <Col xs={8}>
                                        <PlaceHolder xs={10}/>
                                    </Col> :
                                    <Col xs={8} style={{ padding: 0 }}>
                                        <Card.Text style={{
                                            maxWidth: "200px",
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>{tokenBalanceOfAccount.toString(10)}</Card.Text>
                                    </Col>
                                }
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

            <Container style={{ padding: 0, margin: '6px 0' }}>
                <Form.Control
                    size="lg"
                    type="text"
                    onChange={(e) => {
                        if (e?.target?.value) handleSetValue(e.target.value.replace(/[^\d\.]*/g, ''));
                        else {
                            handleSetValue('0');
                        }
                    }}
                    value={value}
                    className={styles.ValueInput}
                    style={inputStyle}
                />
            </Container>

            <Container>
                <Row style={{ gap: '4px' }}>
                    {
                        percent.map((value, index) => {
                            return (
                                <Col key={`button-percent-${index}`} style={{ padding: 0 }}>
                                    <Button
                                        style={{ background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)' }}
                                        className="w-100"
                                        onClick={() => {
                                            handleSetValue(tokenBalanceOfAccount.multipliedBy(value, 10).toString());
                                        }}
                                    >
                                        {value * 100}
                                    </Button>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
        </Container>
    )
};

export default TokenInput;
