'use client'
import AddLiquidity from "@/components/addLiquidity/addLiquidity";
import {Container} from "react-bootstrap";
import LiquidityHeader from "@/components/addLiquidity/components/liquidityHeader";
import {useState} from "react";
import liquidityTabs from "@/constants/liquidityTabs";
import {useSelector} from "react-redux";
import Remove from "@/components/liquidity/remove/Remove";

const Liquidity = () => {
    const {
        slippageTolerance,
    } = useSelector((state: {addLiquidity: any}) => state.addLiquidity);

    const [currentTab, setCurrentTab] = useState<string>(liquidityTabs[0].form);

    const handleSelectTab = (tabForm: string) => {
        const selectedTab = liquidityTabs.find((tab) => tab.form === tabForm);
        setCurrentTab(selectedTab?.form || '');
    };

    return (
        <Container
            className="w-100 m-auto mt-5 pt-3"
            style={{
                backgroundColor: '#2f323d',
                borderRadius: 'var(--bs-border-radius-xl)'
            }}
        >
            <Container className="w-100 p-0">
                <LiquidityHeader
                    slippage={slippageTolerance}
                    currentTab={currentTab}
                    selectTab={handleSelectTab}
                />

                {
                    currentTab === 'add-liquidity' ? (
                        <AddLiquidity />
                    ) : (
                        <Remove/>
                    )
                }

            </Container>
        </Container>
    )
}

export default Liquidity;

