import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import liquidityTabs from "@/constants/liquidityTabs";
import styles from "../Liquidity.module.scss";
import useModal from "@/hooks/useModal";
import SettingModal, {transactionType} from "@/components/swap/modal/settingModal";
import useActionAddLiquidity from "@/state/addLiquidity/useActionAddLiquidity";

const LiquidityHeader: React.FC<{
    slippage: number;
    currentTab: string;
    selectTab: (tabForm: string) => void;
}> = ({ slippage, currentTab, selectTab }) => {
    const { handleChangeSlippageTolerance, handleChangeDeadlineTransaction } = useActionAddLiquidity();

    const [onPresentSettingModal] = useModal('Setting',
        <SettingModal
            type={transactionType.LIQUIDITY}
            handleChangeSlippage={handleChangeSlippageTolerance}
            handleChangeDeadline={handleChangeDeadlineTransaction}
        />
    )

    return (
        <Container className="m-0 mb-3" style={{ width: '700px' }}>
            <Row className="align-items-center w-100">
                <Col xs={7}>
                    <Row>
                        {liquidityTabs.map((tab, index) => (
                            <Col
                                key={`liquidity-header-tab-${index}`}
                                onClick={() => selectTab(tab.form)}
                                className={`${styles.LiquidityHeaderTab} ${currentTab === tab.form ? styles.LiquidityHeaderTabActive : ''}`}
                            >
                                {tab.title}
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col xs={2}></Col>
                <Col xs={3}>
                    <div onClick={onPresentSettingModal} className={styles.LiquidityHeaderSettingContainer}>
                        <div className={styles.LiquidityHeaderSetting}>
                            <div>{slippage}% slippage</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D8D9DA"
                                 className="bi bi-gear" viewBox="0 0 16 16">
                                <path
                                    d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                                <path
                                    d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                            </svg>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default LiquidityHeader;
