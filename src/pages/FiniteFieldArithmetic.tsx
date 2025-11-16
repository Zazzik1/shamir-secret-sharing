import { useState } from 'react';
import Plot from '../components/Plot';
import { lagrangeInterpolateMod, makeShares } from '../util';
import { Link } from 'react-router-dom';
import { Button, Heading, NumberInput } from '../components/shared';
import Table from '../components/Table';

const _PRIME = 2 ** 13 - 1; // https://en.wikipedia.org/wiki/Mersenne_prime

const FiniteFieldArithmetic = () => {
    const [prime, setPrime] = useState(_PRIME);
    const [secret, setSecret] = useState(1234);
    const [numberOfShares, setNumberOfShares] = useState(3);
    const [error, setError] = useState<string | null>(null);

    const { shares, polynomial } = makeShares(secret, numberOfShares, prime);
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
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Heading>
                Shamir's Secret Sharing &gt; Finite field arithmetic &gt; share
                & reconstruct demo
            </Heading>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Link to="/">
                    <Button>integer arithmetic</Button>
                </Link>
                <Link to="/finite-field-string">
                    <Button>finite field - share / reconstruct tool</Button>
                </Link>
            </div>
            <hr style={{ width: '600px' }} />
            <div
                style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'end',
                    flexWrap: 'wrap',
                    marginTop: '8px',
                }}
            >
                <div style={{ fontWeight: '600' }}>
                    Prime
                    <NumberInput
                        value={prime}
                        min={3}
                        onChange={setPrime}
                    />
                </div>
                <div style={{ fontWeight: '600' }}>
                    Secret
                    <NumberInput
                        value={secret}
                        onChange={setSecret}
                        max={prime - 1}
                    />
                </div>
                <div style={{ fontWeight: '600' }}>
                    Number of shares
                    <NumberInput
                        value={numberOfShares}
                        onChange={setNumberOfShares}
                        min={2}
                    />
                </div>
            </div>
            <div
                style={{
                    marginTop: '8px',
                    fontWeight: '600',
                }}
            >
                Shares
            </div>
            <Table
                schema={[
                    {
                        key: 'x',
                        label: 'x (-nth share)',
                        align: 'right',
                    },
                    {
                        key: 'y',
                        label: 'f(x)',
                        align: 'right',
                    },
                ]}
                data={shares}
            />
            {error != null && <div style={{ color: 'red' }}>{error}</div>}
            {recreatedSecret != null && (
                <>
                    <div style={{ marginTop: '8px', fontWeight: '600' }}>
                        Reconstructed f(x)
                    </div>
                    <div>
                        <Plot
                            fn={recreatedPolynomial}
                            x1={-2}
                            x2={2}
                        />
                    </div>
                    <div style={{ marginBottom: '8px', color: 'yellow' }}>
                        {polynomial.label}
                    </div>
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
