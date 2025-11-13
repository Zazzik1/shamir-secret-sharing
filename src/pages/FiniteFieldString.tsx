import { useCallback, useMemo, useState } from 'react';
import { getSecretFromSharesStr, makeSharesStr } from '../util';
import { Link } from 'react-router-dom';

const _PRIME = 2 ** 13 - 1; // https://en.wikipedia.org/wiki/Mersenne_prime

const FiniteFieldString = () => {
    const [secret, setSecret] = useState('hello world');
    const [numberOfShares, setNumberOfShares] = useState(3);
    const [numberOfSharesToReconstruct, setNumberOfSharesToReconstruct] =
        useState(3);
    const [sharesToReconstruct, setSharesToReconstruct] = useState<string[]>(
        [],
    );
    const [reconstructedSecret, setReconstructedSecret] = useState('');
    const shares = useMemo(
        () => makeSharesStr(secret, numberOfShares, _PRIME),
        [secret, numberOfShares],
    );
    const reconstructSecret = useCallback(() => {
        setReconstructedSecret('');
        try {
            const secret = getSecretFromSharesStr(sharesToReconstruct);
            setReconstructedSecret(secret);
        } catch (err) {
            setReconstructedSecret(`Error: ${err}`);
            console.error(err);
        }
    }, [sharesToReconstruct]);
    const loadShares = useCallback(() => {
        setNumberOfSharesToReconstruct(numberOfShares);
        setSharesToReconstruct(shares);
    }, [shares, numberOfShares]);
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to="/">integer arithmetic</Link>
                <Link to="/finite-field">finite field arithmetic</Link>
            </div>
            <div style={{ textAlign: 'center', color: 'lightgreen' }}>
                Share
            </div>
            <div>
                secret ={' '}
                <input
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
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
            <div>shares:</div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '8px',
                }}
            >
                {shares.map((share, id) => (
                    <div
                        key={id}
                        style={{
                            backgroundColor: 'rgb(12, 12, 31)',
                            color: 'rgb(197, 208, 245)',
                            padding: '8px 16px',
                            width: 'max-content',
                            lineBreak: 'anywhere',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            borderRadius: '4px',
                        }}
                    >
                        {share}
                    </div>
                ))}
            </div>
            <div style={{ fontStyle: 'italic' }}>
                All the above shares are required to reconstruct the polynomial
                and the secret
            </div>
            <hr />
            <div style={{ textAlign: 'center', color: 'lightgreen' }}>
                Reconstruct
            </div>
            <div>
                number of shares ={' '}
                <input
                    type="number"
                    value={numberOfSharesToReconstruct}
                    min={2}
                    onChange={(e) => {
                        const value = +e.target.value;
                        if (Number.isNaN(value) || value < 2) return 2;
                        setNumberOfSharesToReconstruct(value);
                        setSharesToReconstruct((old) => old.slice(0, value));
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '8px',
                }}
            >
                {Array.from(
                    { length: numberOfSharesToReconstruct },
                    (_, id) => (
                        <input
                            key={id}
                            placeholder={`share ${id + 1}`}
                            value={sharesToReconstruct[id] ?? ''}
                            onChange={(e) =>
                                setSharesToReconstruct((old) => {
                                    const newShares = [...old];
                                    newShares[id] = e.target.value;
                                    return newShares;
                                })
                            }
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'rgb(12, 12, 31)',
                                color: 'rgb(197, 208, 245)',
                                border: '1px solid rgb(26, 26, 61)',
                                borderRadius: '2px',
                            }}
                        />
                    ),
                )}
            </div>
            <button onClick={loadShares}>load shares from previous step</button>
            <button onClick={reconstructSecret}>reconstruct</button>
            <div>reconstructed secret: </div>
            <div
                style={{
                    color: 'lightgreen',
                    maxWidth: '100%',
                    lineBreak: 'anywhere',
                }}
            >
                {reconstructedSecret}
            </div>
        </div>
    );
};

export default FiniteFieldString;
