import { useState } from 'react';
import Plot from './components/Plot';
import { preparePolynomial } from './util';

function App() {
    const [polynomial, setPolynomial] = useState<
        ReturnType<typeof preparePolynomial>
    >(preparePolynomial(1234, 3));
    const [range, setRange] = useState<{ x1: number; x2: number }>({
        x1: -2,
        x2: 2,
    });
    return (
        <>
            <Plot
                fn={polynomial.fn}
                x1={range.x1}
                x2={range.x2}
            />
            <div style={{ marginTop: '16px' }}>
                x1, x2&nbsp;
                <input
                    type="number"
                    value={range.x1}
                    step="0.2"
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (value >= range.x2) return;
                        setRange((old) => ({
                            ...old,
                            x1: value,
                        }));
                    }}
                />
                <input
                    type="number"
                    value={range.x2}
                    step="0.2"
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (value <= range.x1) return;
                        setRange((old) => ({
                            ...old,
                            x2: value,
                        }));
                    }}
                />
            </div>
            <div>{polynomial.label}</div>
            <div>f(0) = {polynomial.fn(0)}</div>
            <div>f(1) = {polynomial.fn(1)} - 1st share</div>
            <div>f(2) = {polynomial.fn(2)} - 2nd share</div>
            <div>f(3) = {polynomial.fn(3)} - 3rd share</div>
            <div>
                <button
                    onClick={() => setPolynomial(preparePolynomial(1234, 3))}
                >
                    reset polynomial
                </button>
            </div>
        </>
    );
}

export default App;
