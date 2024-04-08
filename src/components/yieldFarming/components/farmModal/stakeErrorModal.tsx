import {ModalBody} from "react-bootstrap";
import TriangleError from "@/assets/icons/triangleError";
import Row from "react-bootstrap/Row";

export const enum ErrorType {
    ZERO,
    INSUFFICIENT,
    COMMON
}
export const StakeErrorModal: React.FC<{
    error: ErrorType
}> = ({error}) => {
    const getMessageError = (error: ErrorType) => {
        let message;
        switch (error) {
            case ErrorType.ZERO:
                message = "Amount can not be ZERO";
                break;
            case ErrorType.INSUFFICIENT:
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
