import {Card} from "react-bootstrap";
import {useChainId} from "wagmi";

const WalletInfo: React.FC<{
    accountAddress: string;
    balanceAccount: number
}> = ({accountAddress, balanceAccount}) => {
    const chainId = useChainId();
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{accountAddress}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{chainId}</Card.Subtitle>
                <Card.Text>
                    Balance: {balanceAccount}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}
export default WalletInfo
