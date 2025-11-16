import { useCallback, useMemo, useState } from 'react';
import { getSecretFromSharesStr, makeSharesStr } from '../util';
import { Link } from 'react-router-dom';
import {
    Button,
    Heading,
    NumberInput,
    ShareInput,
    ShareOutput,
    TextArea,
} from '../components/shared';

// this prime must be large enough to fit unicode characters such as 🗝️ or ⭐
const _PRIME = 2 ** 17 - 1; // https://en.wikipedia.org/wiki/Mersenne_prime
const initialSecret = `hello world
test 123
super secret`;

const FiniteFieldString = () => {
    const [secret, setSecret] = useState(initialSecret);
    const [numberOfShares, setNumberOfShares] = useState(3);
    const [numberOfSharesToReconstruct, setNumberOfSharesToReconstruct] =
        useState(3);
    const [sharesToReconstruct, setSharesToReconstruct] = useState<string[]>(
        [],
    );
    const [error, setError] = useState<string | null>(null);
    const [reconstructedSecret, setReconstructedSecret] = useState('');
    const shares = useMemo(
        () => makeSharesStr(secret, numberOfShares, _PRIME),
        [secret, numberOfShares],
    );
    const reconstructSecret = useCallback(() => {
        setReconstructedSecret('');
        setError(null);
        try {
            const secret = getSecretFromSharesStr(sharesToReconstruct);
            setReconstructedSecret(secret);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        }
    }, [sharesToReconstruct]);
    const loadShares = useCallback(() => {
        setNumberOfSharesToReconstruct(numberOfShares);
        setSharesToReconstruct(shares);
    }, [shares, numberOfShares]);
    return (
        <div style={{ padding: '8px', paddingTop: 0 }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Heading size="md">
                    Shamir's Secret Sharing &gt; Finite field arithmetic &gt;
                    share & reconstruct tool
                </Heading>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <Link to="/">
                        <Button>integer arithmetic</Button>
                    </Link>
                    <Link to="/finite-field">
                        <Button>finite field arithmetic</Button>
                    </Link>
                </div>
                <hr style={{ width: '600px' }} />
            </div>
            <Heading
                size="sm"
                style={{ textAlign: 'center' }}
            >
                Share
            </Heading>
            <div style={{ marginTop: '8px', fontWeight: '600' }}>
                Secret
                <br />
                <TextArea
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    rows={8}
                    cols={60}
                    data-test-name="secret"
                />
            </div>
            <div style={{ marginTop: '8px', fontWeight: '600' }}>
                Number of shares
                <NumberInput
                    value={numberOfShares}
                    onChange={setNumberOfShares}
                    min={2}
                    max={12}
                />
            </div>
            <div style={{ marginTop: '8px', fontWeight: '600' }}>Shares</div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '8px 0',
                }}
            >
                {shares.map((share, id) => (
                    <ShareOutput key={id}>{share}</ShareOutput>
                ))}
            </div>
            <div style={{ fontStyle: 'italic' }}>
                All the above shares are required to reconstruct the polynomials
                and the secret
            </div>
            <hr />
            <Heading
                size="sm"
                style={{ textAlign: 'center' }}
            >
                Reconstruct
            </Heading>
            <div style={{ marginTop: '8px', fontWeight: '600' }}>
                Number of shares
                <NumberInput
                    value={numberOfSharesToReconstruct}
                    onChange={(value) => {
                        setNumberOfSharesToReconstruct(value);
                        setSharesToReconstruct((old) => old.slice(0, value));
                    }}
                    min={2}
                    max={12}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '8px 0',
                }}
            >
                {Array.from(
                    { length: numberOfSharesToReconstruct },
                    (_, id) => (
                        <ShareInput
                            key={id}
                            placeholder={`Paste the share ${id + 1} here`}
                            value={sharesToReconstruct[id] ?? ''}
                            onChange={(e) =>
                                setSharesToReconstruct((old) => {
                                    const newShares = [...old];
                                    newShares[id] = e.target.value;
                                    return newShares;
                                })
                            }
                        />
                    ),
                )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button onClick={loadShares}>
                    Load shares from previous step
                </Button>
                <Button
                    onClick={reconstructSecret}
                    disabled={
                        sharesToReconstruct.reduce((acc, share) => {
                            return share.length ? acc + 1 : acc;
                        }, 0) < numberOfSharesToReconstruct
                    }
                >
                    Reconstruct
                </Button>
            </div>
            <div style={{ marginTop: '8px', fontWeight: '600' }}>
                Reconstructed secret
            </div>
            <div
                style={{
                    maxWidth: 'calc(100% - 16px)',
                    width: 'max-content',
                    minWidth: '30ch',
                    minHeight: '16ch',
                    lineBreak: 'anywhere',
                    fontSize: '14px',
                    backgroundColor: 'rgb(19, 22, 14)',
                    color: 'rgb(186, 211, 146)',
                    fontFamily: 'RobotoMono, monospace',
                    borderRadius: '2px',
                    padding: '8px',
                    border: '1px solid rgb(46, 53, 35)',
                    boxSizing: 'border-box',
                }}
                data-test-name="reconstructed-secret"
            >
                {error != null ? (
                    <span style={{ color: 'red', fontStyle: 'italic' }}>
                        Error: {error}
                    </span>
                ) : reconstructedSecret === '' ? (
                    <span style={{ color: 'gray', fontStyle: 'italic' }}>
                        Result will appear here after you click Reconstruct.
                    </span>
                ) : (
                    <pre style={{ margin: 0 }}>{reconstructedSecret}</pre>
                )}
            </div>
        </div>
    );
};

export default FiniteFieldString;
