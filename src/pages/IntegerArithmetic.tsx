import { useCallback, useEffect, useState } from 'react';
import Plot from '../components/Plot';
import { FX, lagrangeInterpolate, Point, preparePolynomial } from '../util';
import { Link } from 'react-router-dom';
import { Button, Heading, NumberInput } from '../components/shared';
import Table from '../components/Table';

function IntegerArithmeticPage() {
    const [secret, setSecret] = useState(1234);
    const [numberOfShares, setNumberOfShares] = useState(4);
    const [polynomial, setPolynomial] = useState<
        ReturnType<typeof preparePolynomial>
    >({
        fn: () => 1,
        label: <>f(x) = 1</>,
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
                <Heading>
                    Shamir's Secret Sharing &gt; Integer arithmetic &gt; share &
                    reconstruct demo
                </Heading>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                    }}
                >
                    <Link to="/finite-field">
                        <Button>finite field arithmetic</Button>
                    </Link>
                    <Link to="/finite-field-string">
                        <Button>finite field - share / reconstruct tool</Button>
                    </Link>
                </div>
                <hr style={{ width: '600px' }} />
                <div
                    style={{
                        marginTop: '8px',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'end',
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ fontWeight: '600' }}>
                        Secret
                        <NumberInput
                            value={secret}
                            onChange={setSecret}
                        />
                    </div>
                    <div style={{ fontWeight: '600' }}>
                        Number of shares
                        <NumberInput
                            value={numberOfShares}
                            onChange={setNumberOfShares}
                            min={2}
                            max={20}
                        />
                    </div>
                    <div>
                        <Button onClick={handleResetPolynomial}>
                            reset polynomial
                        </Button>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '32px',
                        marginTop: '8px',
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <div style={{ fontWeight: '600' }}>Original f(x)</div>
                        <Plot
                            fn={polynomial.fn}
                            x1={range.x1}
                            x2={range.x2}
                        />
                        <div style={{ marginBottom: '8px', color: 'yellow' }}>
                            {polynomial.label}
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
                        <div style={{ fontWeight: '600' }}>
                            Reconstructed f(x)
                        </div>
                        <Plot
                            fn={recreatedPolynomial.fn}
                            x1={range.x1}
                            x2={range.x2}
                        />
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
                                    value: secret,
                                },
                                {
                                    name: 'from polynomial reconstructed based on shares',
                                    value: `${recreatedF0} (${
                                        recreatedF0 === secret ? 'OK' : 'NOK'
                                    })`,
                                },
                            ]}
                        />
                    </div>
                </div>
                <div
                    style={{
                        marginTop: '16px',
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        marginBottom: '16px',
                    }}
                >
                    <div>x1, x2&nbsp;</div>
                    <NumberInput
                        value={range.x1}
                        step={0.2}
                        onChange={(value) => {
                            if (value >= range.x2) return;
                            setRange((old) => ({
                                ...old,
                                x1: value,
                            }));
                        }}
                    />
                    <NumberInput
                        value={range.x2}
                        step={0.2}
                        onChange={(value) => {
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
