import React from "react";
import Modal from "react-bootstrap/Modal";
import Token from "@/entities/token";
const swapModal: React.FC<{
    onDismiss?: () => void,
    tokens: Token[]
}> = ({
    onDismiss = () => null,
    tokens,
}): React.ReactNode => {
    return <Modal.Body>

    </Modal.Body>
}
