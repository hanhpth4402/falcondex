'use client'
import Trade from "@/components/Trade";
import {Container} from "react-bootstrap";
import PoolList from "@/components/PoolList";
import Row from "react-bootstrap/Row";

const swap = () => {
    return (
        <Container style={{ margin: '0 0 0 20px' }}>
            <Row
                style={{
                    padding: 0,
                    gap: '12px'
                }}
            >
                <PoolList />
                <Trade/>
            </Row>
        </Container>
    )
};

export default swap;
