import {Card} from "react-bootstrap";
import {useAccount, useBalance, useChainId, useConnect} from "wagmi";

const Information = () => {
    const {address} = useAccount();
    const chainId = useChainId();
    const { data, isError, isLoading } = useBalance({
        address,
    });
    const {connectors} = useConnect();
    const connect = connectors.find((item) => item);
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{address || "not connected"}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{connect?.name}</Card.Subtitle>
                <Card.Text>
                    Balance: {data?.formatted}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Information;
