import {ModalBody} from "react-bootstrap";
import TriangleError from "@/assets/icons/triangleError";
import Row from "react-bootstrap/Row";

export const enum WithdrawErrorType {
    TIME,
    ZERO,
    INSUFFICIENT,
    COMMON
}
export const WithdrawErrorModal: React.FC<{
    error: WithdrawErrorType
}> = ({error}) => {
    const getMessageError = (error: WithdrawErrorType) => {
        let message;
        switch (error) {
            case WithdrawErrorType.TIME:
                message = "It's not time to withdraw your LP Token";
                break;
            case WithdrawErrorType.ZERO:
                message = "Amount can not be ZERO";
                break;
            case WithdrawErrorType.INSUFFICIENT:
                message = "Insufficient balance";
                break;
            default:
                message = "You have some unexpected issue, you can try later";
                break;
        };
        return message;
    }
    return (
        <ModalBody className={'d-flex row justify-content-center align-items-center'}>
            <Row className={'justify-content-center'}>
                Unexpected Issues!
            </Row>
            <Row className={'justify-content-center'}>
                <Row className={'m-auto w-50'}>
                    <TriangleError width={20} fill={'#F85A5A'}/>
                </Row>
            </Row>
            <Row className={'justify-content-center'}>
                {getMessageError(error)}
            </Row>
        </ModalBody>
    )
}
