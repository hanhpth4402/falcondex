'use client'

import {Container} from "react-bootstrap";
import FarmHeader from "@/components/yieldFarming/components/FarmHeader";
import FarmPools from "@/components/yieldFarming/components/FarmPools";

const yieldFarming = () => {
    return (
        <Container
            className="w-100 m-auto mt-5 pt-3"
            style={{
                backgroundColor: '#2f323d',
                borderRadius: 'var(--bs-border-radius-xl)'
            }}
        >
            <FarmHeader />
            <FarmPools />
        </Container>
    )
}

export default yieldFarming;
