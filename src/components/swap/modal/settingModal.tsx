import {ModalBody} from "react-bootstrap";
import {Input} from "postcss";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import {useSelector} from "react-redux";
import {useState} from "react";

const SlippagePercent = ['5', '10', '15'];

export enum transactionType {
    SWAP,
    LIQUIDITY
}
const SettingModal: React.FC<{
    onDismiss?: () => void,
    handleChangeSlippage: (value: string) => void,
    handleChangeDeadline: (value: number) => void,
    type: transactionType,
}> = ({
    onDismiss = () => null,
    handleChangeSlippage,
    handleChangeDeadline,
    type
}) => {
    const {slippageTolerance: slippageTolerance0, deadline: deadline0} = useSelector((state: {swap: {slippageTolerance: number, deadline: number}}) => state.swap);
    const {slippageTolerance: slippageTolerance1, deadline: deadline1} = useSelector((state: {addLiquidity: {slippageTolerance: number, deadline: number}}) => state.addLiquidity);
    return (
        <ModalBody>
            Slippage Tolerance
            <Row style={{ marginTop: '12px' }}>
                {
                    SlippagePercent.map((item, index) => {
                        return <Col xs={2} key={`percent-${item}-${index}`}>
                            <Button
                                onClick={() => {
                                    handleChangeSlippage(item)
                                }}
                                style={{ background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)' }}
                            >
                                {item}%
                            </Button>
                        </Col>
                    })
                }
                <Col>
                    <Form.Control
                        value={type === transactionType.SWAP ? slippageTolerance0 : slippageTolerance1}
                        onChange={(event) => {
                            handleChangeSlippage(event.target.value);
                        }}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '12px', alignItems: 'center' }}>
                <Col>Tx deadline (mins)</Col>
                <Col>
                    <Form.Control
                        value={type === transactionType.SWAP ? deadline0 : deadline1}
                        onChange={(event) => {
                            handleChangeDeadline(Number(event?.target?.value || '0'));
                        }}
                    />
                </Col>
            </Row>
        </ModalBody>
    )
};
export default SettingModal;
