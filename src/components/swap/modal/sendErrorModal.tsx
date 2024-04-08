import Row from "react-bootstrap/Row";
import TriangleError from "@/assets/icons/triangleError";
import {ModalBody} from "react-bootstrap";

export const SendErrorModal: React.FC<{text: string}> = ({text}) => {
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
                Send Token Failed Because of {text}
            </Row>
        </ModalBody>
    )
}
