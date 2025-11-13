import { useState } from 'react';
import Plot from '../components/Plot';
import { lagrangeInterpolateMod, makeShares } from '../util';
import { Link } from 'react-router-dom';

const _PRIME = 2 ** 13 - 1; // https://en.wikipedia.org/wiki/Mersenne_prime

const FiniteFieldArithmetic = () => {
    const [prime, setPrime] = useState(_PRIME);
    const [secret, setSecret] = useState(1234);
    const [numberOfShares, setNumberOfShares] = useState(3);
    const [error, setError] = useState<string | null>(null);

    const shares = makeShares(secret, numberOfShares, prime);
    const recreatedPolynomial = lagrangeInterpolateMod(shares, prime);
    let recreatedSecret: number | null = null;
    try {
        recreatedSecret = recreatedPolynomial(0);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
            setPrime(_PRIME);
        }
    }
    return (
        <div>
            <div style={{ fontWeight: '600', color: 'rgb(158, 190, 128)' }}>
                Shamir's Secret Sharing - Finite field arithmetic - share &
                reconstruct demo
            </div>
            <Link to="/">integer arithmetic</Link>
            <div>
                prime ={' '}
                <input
                    type="number"
                    value={prime}
                    onChange={(e) => {
                        const value = +e.target.value;
                        if (Number.isNaN(value)) return;
                        setPrime(value);
                    }}
                />
            </div>
            <div>
                secret ={' '}
                <input
                    type="number"
                    value={secret}
                    onChange={(e) => {
                        const value = +e.target.value;
                        if (Number.isNaN(value)) return;
                        setSecret(value);
                    }}
                />
            </div>
            <div>
                number of shares ={' '}
                <input
                    type="number"
                    value={numberOfShares}
                    min={2}
                    onChange={(e) => {
                        const value = +e.target.value;
                        if (Number.isNaN(value) || value < 2) return 2;
                        setNumberOfShares(value);
                    }}
                />
            </div>
            <hr />
            <div>shares:</div>
            <div style={{}}>
                {shares.map((p) => (
                    <div
                        key={p.x}
                        style={{ display: 'flex', gap: '32px' }}
                    >
                        <div>x: {p.x}</div>
                        <div>y: {p.y}</div>
                    </div>
                ))}
            </div>
            <hr />
            {error != null && <div style={{ color: 'red' }}>{error}</div>}
            {recreatedSecret != null && (
                <>
                    <div>Reconstructed f(x)</div>
                    <Plot
                        fn={recreatedPolynomial}
                        x1={-2}
                        x2={2}
                    />
                    <div>
                        secret from reconstructed polynomial: f(0) ={' '}
                        {recreatedSecret}
                    </div>
                </>
            )}
        </div>
    );
};

export default FiniteFieldArithmetic;
