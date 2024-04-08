import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useConnect} from "wagmi";
const ConnectorModal = ({onDismiss = () => null}) => {
    const { connect, connectors } = useConnect();
    return (
        <Modal.Body>
            {
                connectors.map((connector, index) => {
                    return (
                        <Button
                            key={connector.name+index}
                            style={{margin: "5px", background: 'radial-gradient(circle at 10% 20%, rgb(67, 144, 233) 0%, rgb(78, 226, 198) 90.1%)', border: 'none'}}
                            onClick={() => {
                                onDismiss();
                                connect({connector});
                            }}
                        >
                            {connector.name}
                        </Button>
                    )
                })
            }
        </Modal.Body>
    )
};

export default ConnectorModal;
