import Range from "@/assets/icons/range";
import {Container} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

const RemoveAmount: React.FC<{
    state: number,
    handleChangeState: (state: number) => void,
    liquidityAmount: string,
}> = ({state, handleChangeState, liquidityAmount}) => {
    return (
        <Container
            className={'d-flex row'}
            style={{
                color: '#D8D9DA',
                backgroundColor: '#1b1e29',
                borderRadius: 'var(--bs-border-radius-xl)',
                paddingTop: '12px',
                minWidth: '500px'
            }}
        >
            <Container
                className={'d-flex row'}
                style={{
                    backgroundColor: '#252833',
                    borderRadius: 'var(--bs-border-radius-xl)',
                    padding: '12px',
                    margin: '0px 0px 20px',
                }}
            >
                Remove Amount:
                <div style={{fontSize: "25px", padding: '0px', margin: '0px'}}>
                    {liquidityAmount || '0'}
                </div>
                <div style={{fontSize: "50px", padding: '0px', margin: '0px'}}>
                    {state} %
                </div>
            </Container>
            <Container
                className={'d-flex justify-content-between'}
                style={{
                    backgroundColor: '#252833',
                    borderRadius: 'var(--bs-border-radius-xl)',
                    padding: '12px',
                    marginBottom: '20px'
                }}
            >
                <Range state={state} setState={handleChangeState}/>
            </Container>
        </Container>
    )
}

export default RemoveAmount;
