import Placeholder from 'react-bootstrap/Placeholder';
import {Card} from "react-bootstrap";

const PlaceHolder = ({xs}: {xs: number}) => {
    return (
        <Placeholder animation="glow">
            <Placeholder xs={xs} />
        </Placeholder>
    )
}

export default PlaceHolder;
