import { useState } from 'react';
import Plot from '../components/Plot';
import { lagrangeInterpolateMod, makeShares } from '../util';
import { Link } from 'react-router-dom';
import {
    BORDER_COLOR,
    Button,
    CARD_BACKGROUND_COLOR,
    Footer,
    Heading,
    HEADING_TEXT_COLOR,
    NumberInput,
} from '../components/shared';
import Table from '../components/Table';
import styled from '@emotion/styled';

const _PRIME = 2 ** 13 - 1; // https://en.wikipedia.org/wiki/Mersenne_prime
const INITIAL_SECRET = 1234;

const Content = styled.div`
    flex-grow: 1;
    background-color: ${CARD_BACKGROUND_COLOR};
    border-left: 1px solid ${BORDER_COLOR};
    border-right: 1px solid ${BORDER_COLOR};
    padding: 16px 64px;

    @media (max-width: 600px) {
        border-left: none;
        border-right: none;
        padding: 16px 8px;
    }
`;

const FiniteFieldArithmetic = () => {
    const [prime, setPrime] = useState(_PRIME);
    const [secret, setSecret] = useState(INITIAL_SECRET);
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
            setSecret(INITIAL_SECRET);
        }
    }
    const polynomialF0 = polynomial.fn(0);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <div
                style={{
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                    width: '100%',
                    paddingBottom: '16px',
                }}
            >
                <Heading>
                    Shamir's Secret Sharing &gt; Finite field arithmetic &gt;
                    share & reconstruct demo
                </Heading>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        justifyContent: 'center',
                    }}
                >
                    <Link to="/">
                        <Button>integer arithmetic</Button>
                    </Link>
                    <Link to="/finite-field-string">
                        <Button>finite field - share / reconstruct tool</Button>
                    </Link>
                </div>
            </div>
            <Content>
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
                            onChange={(n) => {
                                setError(null);
                                setPrime(n);
                                if (secret >= n) setSecret(n - 1);
                            }}
                        />
                    </div>
                    <div style={{ fontWeight: '600' }}>
                        Secret
                        <NumberInput
                            value={secret}
                            min={0}
                            onChange={(secret) => {
                                setError(null);
                                setSecret(secret);
                            }}
                            max={prime - 1}
                        />
                    </div>
                    <div style={{ fontWeight: '600' }}>
                        Number of shares
                        <NumberInput
                            value={numberOfShares}
                            onChange={(n) => {
                                setError(null);
                                setNumberOfShares(n);
                            }}
                            min={2}
                        />
                    </div>
                </div>
                {error != null && (
                    <div style={{ margin: '16px 0', color: 'red' }}>
                        {error}
                    </div>
                )}
                <div style={{ margin: '16px 0', color: HEADING_TEXT_COLOR }}>
                    {polynomial.label}
                </div>
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    <div>
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
                    </div>
                    <div>
                        <div
                            style={{
                                marginTop: '8px',
                                fontWeight: '600',
                            }}
                        >
                            Secret
                        </div>
                        <Table
                            schema={[
                                {
                                    key: 'name',
                                    label: 'secret',
                                    align: 'left',
                                },
                                {
                                    key: 'value',
                                    label: 'f(0)',
                                    align: 'right',
                                },
                            ]}
                            data={[
                                {
                                    name: 'from original polynomial',
                                    value: `${polynomialF0} (${
                                        polynomialF0 === secret ? 'OK' : 'NOK'
                                    })`,
                                },
                                {
                                    name: 'from polynomial reconstructed based on shares',
                                    value: `${recreatedSecret} (${
                                        recreatedSecret === secret
                                            ? 'OK'
                                            : 'NOK'
                                    })`,
                                },
                            ]}
                        />
                    </div>
                </div>
                {recreatedSecret != null && (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                gap: '32px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        marginTop: '16px',
                                        fontWeight: '600',
                                    }}
                                >
                                    Original f(x)
                                </div>
                                <Plot
                                    fn={polynomial.fn}
                                    x1={-2}
                                    x2={2}
                                />
                            </div>
                            <div>
                                <div
                                    style={{
                                        marginTop: '16px',
                                        fontWeight: '600',
                                    }}
                                >
                                    Reconstructed f(x)
                                </div>
                                <Plot
                                    fn={recreatedPolynomial}
                                    x1={-2}
                                    x2={2}
                                />
                            </div>
                        </div>
                    </>
                )}
            </Content>
            <Footer />
        </div>
    );
};

export default FiniteFieldArithmetic;
