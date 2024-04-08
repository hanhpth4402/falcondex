import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../YieldFarming.module.scss";

const FarmHeader: React.FC = () => {
    return (
        <Container>
            <Row className={styles.FarmHeader}>
                <Col>Farm Pools</Col>
                <Col xs={2}>Filter</Col>
                <Col xs={1}>Staked</Col>
            </Row>
        </Container>
    )
}

export default FarmHeader;