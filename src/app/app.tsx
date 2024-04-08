import {useContext, useState} from "react";
import Swap from "@/components/Trade";
import ModalContext, {ModalProvider} from "@/contexts/ModalContext/Provider";

const App = () => {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    }
    const abc = useContext(ModalContext);
    return (
        <>
            <ModalProvider>
                {/*<ConnectWallet/>*/}
                {/*<Information/>*/}
                <Swap/>
            </ModalProvider>
        </>
    )
}

export default App;
