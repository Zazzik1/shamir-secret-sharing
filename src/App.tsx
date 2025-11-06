import { useMemo, useState } from 'react';
import Plot from './components/Plot';
import { lagrangeInterpolate, preparePolynomial } from './util';

function App() {
    const [polynomial, setPolynomial] = useState<
        ReturnType<typeof preparePolynomial>
    >(preparePolynomial(1234, 3));
    const [range, setRange] = useState<{ x1: number; x2: number }>({
        x1: -2,
        x2: 2,
    });
    const share1 = polynomial.fn(1);
    const share2 = polynomial.fn(2);
    const share3 = polynomial.fn(3);
    const recreatedPolynomial = useMemo(
        () =>
            lagrangeInterpolate([
                {
                    x: 1,
                    y: share1,
                },
                {
                    x: 2,
                    y: share2,
                },
                {
                    x: 3,
                    y: share3,
                },
            ]),
        [share1, share2, share3],
    );
    return (
        <>
            <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                    <div>Original</div>
                    <Plot
                        fn={polynomial.fn}
                        x1={range.x1}
                        x2={range.x2}
                    />
                </div>
                <div>
                    <div>Recreated</div>
                    <Plot
                        fn={recreatedPolynomial}
                        x1={range.x1}
                        x2={range.x2}
                    />
                </div>
            </div>
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
            <div>f(1) = {share1} - 1st share</div>
            <div>f(2) = {share2} - 2nd share</div>
            <div>f(3) = {share3} - 3rd share</div>
            <div>
                secret from polynomial recreated based on shares:{' '}
                {recreatedPolynomial(0)}
            </div>
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
