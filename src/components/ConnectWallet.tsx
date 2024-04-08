import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useAccount, useConnect, useDisconnect} from "wagmi";
const ConnectWallet: React.FC<{ show: boolean; handleShow: () => void; handleClose: () => void }>=
    ({
        show,
        handleClose
     }) => {
    const {connectAsync, connectors, pendingConnector, } = useConnect();
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Connect Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex gap-2">
                    {connectors.map((connector, index) => {
                        return (
                            <Button
                                onClick={async () => {
                                    await connectAsync({connector}).then(() => {
                                        handleClose();
                                    })
                                }}
                                key={connector.id+index}
                                disabled={!connector.ready}
                            >
                                {connector.name}
                            </Button>
                        )
                    })}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ConnectWallet;
