import React, {createContext, useCallback, useMemo, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from './Provider.module.scss';

interface ModalContextType {
    isOpen: boolean,
    heading: string,
    content: React.ReactNode,
    setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>,
    setHeading: React.Dispatch<React.SetStateAction<string>>,
    setPresent: (node: React.ReactNode) => void,
    onDismiss: () => void,
}

const ModalContext = createContext<ModalContextType>({
    isOpen: false,
    heading: '',
    content: null,
    setHeading: () => null,
    setContent: () => null,
    setPresent: () => {},
    onDismiss: () => {},
});

export const ModalProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<React.ReactNode>();
    const [heading, setHeading] = useState("");
    const handlePresent = useCallback((node: React.ReactNode) => {
        setIsOpen(true);
        setContent(node);
    }, []);
    const handleDimiss = () => {
        setIsOpen(false);
        setContent(undefined);
    }
    const valueProvider = useMemo(() => (
        {
            isOpen,
            heading,
            content,
            setContent,
            setHeading,
            setPresent: handlePresent,
            onDismiss: handleDimiss,
        }
    ), [isOpen, content, setContent, handlePresent])
    return (
        <ModalContext.Provider value={valueProvider}>
            <Modal
                show={isOpen}
                onHide={handleDimiss}
                backdrop="static"
                keyboard={false}
                className={styles.ModalCustom}
            >
            <div className={styles.ModalCustomContainer}>
                <Modal.Header closeButton>
                    <Modal.Title>{heading}</Modal.Title>
                </Modal.Header>
                {React.isValidElement(content) && (
                    React.cloneElement(content, {
                            onDismiss: handleDimiss,
                        } as any
                    ))}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDimiss}>
                        Close
                    </Button>
                </Modal.Footer>
            </div>
            </Modal>
            {children}
        </ModalContext.Provider>
    )
}
export default ModalContext;

