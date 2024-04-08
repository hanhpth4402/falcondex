'use client'
import {useSelector} from "react-redux";
import {Container} from "react-bootstrap";
import SwapHeader from "@/components/swap/components/SwapHeader";
import {useState} from "react";
import tradeTabs from "@/constants/tradeTabs";
import Swap from "@/components/swap/components/Swap";
import Send from "@/components/swap/components/Send";

const Trade = () => {
    const {
        slippageTolerance,
    } = useSelector((state: {swap: any}) => state.swap);

    const [currentTab, setCurrentTab] = useState<string>(tradeTabs[0].form);

    const handleSelectTab = (tabForm: string) => {
        const selectedTab = tradeTabs.find((tab) => tab.form === tabForm);
        setCurrentTab(selectedTab?.form || '');
    }

    return (
        <Container style={{ width: '700px', backgroundColor: '#2f323d', margin: 0, marginTop: '20px', padding: '12px', borderRadius: 'var(--bs-border-radius-xl)' }}>
            <SwapHeader
                slippage={slippageTolerance}
                selectTab={handleSelectTab}
                currentTab={currentTab}
            />

            {
                currentTab === 'swap' ? (
                    <Swap />
                ) : (
                    <Send />
                )
            }
        </Container>
    )
}

export default Trade;
