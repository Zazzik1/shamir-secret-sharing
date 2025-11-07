import { useCallback, useEffect, useState } from 'react';
import Plot from '../components/Plot';
import { FX, lagrangeInterpolate, Point, preparePolynomial } from '../util';

function IntegerArithmeticPage() {
    const [secret, setSecret] = useState(1234);
    const [numberOfShares, setNumberOfShares] = useState(4);
    const [polynomial, setPolynomial] = useState<
        ReturnType<typeof preparePolynomial>
    >({
        fn: () => 1,
        label: 'f(x) = 1',
    });
    const [range, setRange] = useState<{ x1: number; x2: number }>({
        x1: -2,
        x2: 2,
    });
    const [shares, setShares] = useState<Point[]>([]);
    const [recreatedPolynomial, setRecreatedPolynomial] = useState<{ fn: FX }>({
        fn: () => 1,
    });

    const handleResetPolynomial = useCallback(() => {
        const polynomial = preparePolynomial(secret, numberOfShares);
        setPolynomial(polynomial);
        const shares = Array.from({ length: numberOfShares }, (_, i) => ({
            x: i + 1,
            y: polynomial.fn(i + 1),
        }));
        setShares(shares);
        setRecreatedPolynomial({ fn: lagrangeInterpolate(shares) });
    }, [numberOfShares, secret]);

    useEffect(() => {
        handleResetPolynomial();
    }, [handleResetPolynomial]);

    const recreatedF0 = recreatedPolynomial.fn(0);

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div style={{ fontWeight: '600', color: 'rgb(158, 190, 128)' }}>
                    Shamir's Secret Sharing - Integer arithmetic - share &
                    reconstruct demo
                </div>
                <div>
                    secret:{' '}
                    <input
                        type="number"
                        value={secret}
                        onChange={(e) => setSecret(e.target.valueAsNumber)}
                    />
                </div>
                <div>
                    number of shares:{' '}
                    <input
                        type="number"
                        value={numberOfShares}
                        min="2"
                        onChange={(e) =>
                            setNumberOfShares(e.target.valueAsNumber)
                        }
                    />
                </div>
                <div>
                    <button onClick={handleResetPolynomial}>
                        reset polynomial
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '32px' }}>
                    <div>
                        <div>Original f(x)</div>
                        <Plot
                            fn={polynomial.fn}
                            x1={range.x1}
                            x2={range.x2}
                        />
                        <div>{polynomial.label}</div>
                        <div>f(0) = {polynomial.fn(0)}</div>
                        {shares.map((share, i) => (
                            <div key={i}>
                                f({share.x}) = {share.y} - share {i + 1}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div>Reconstructed f(x)</div>
                        <Plot
                            fn={recreatedPolynomial.fn}
                            x1={range.x1}
                            x2={range.x2}
                        />
                        <div>
                            secret from polynomial recreated based on shares:
                            f(0) = {recreatedF0} (
                            {recreatedF0 === secret ? 'OK' : 'NOK'})
                        </div>
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
            </div>
        </>
    );
}

export default IntegerArithmeticPage;
