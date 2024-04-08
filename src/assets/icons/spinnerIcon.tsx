import {Spinner} from "react-bootstrap";


const SpinnerIcon: React.FC<{text: string}> = ({text}) => {
    return (
        <>
            <Spinner animation="border" size={"sm"}/> Waiting to {text}...
        </>
    )
}

export default SpinnerIcon;
