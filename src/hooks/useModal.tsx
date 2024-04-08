import {useCallback, useContext} from "react";
import ModalContext from "@/contexts/ModalContext/Provider";

const useModal = (
    heading: string,
    content: React.ReactNode,
): [() => void, () => void] => {
    const {isOpen, setHeading, setContent, setPresent, onDismiss} = useContext(ModalContext);
    const onPresentCallback = useCallback(() => {
        setHeading(heading);
        setPresent(content);
    }, [heading, content])
    return [onPresentCallback, onDismiss]
};
export default useModal;
