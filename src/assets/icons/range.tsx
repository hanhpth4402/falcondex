import Form from 'react-bootstrap/Form';
import localFont from "next/dist/compiled/@next/font/dist/local";

function Range({state, setState}: {
    state: number,
    setState: (state: number) => void,
}) {
    return (
        <>
            <Form.Range
                value={state}
                onChange={(event) => {
                    setState(Number(event.target.value));
                }}
            />
        </>
    );
}

export default Range;
