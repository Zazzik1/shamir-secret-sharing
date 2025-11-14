import React, { useCallback, useMemo, useState } from 'react';
import { getSecretFromSharesStr, makeSharesStr } from '../util';
import { Link } from 'react-router-dom';

const _PRIME = 2 ** 13 - 1; // https://en.wikipedia.org/wiki/Mersenne_prime
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
        <div style={{ padding: '8px' }}>
            <div
                style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: 'rgb(158, 190, 128)',
                }}
            >
                Shamir's Secret Sharing - Finite field arithmetic - share &
                reconstruct tool
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to="/">integer arithmetic</Link>
                <Link to="/finite-field">finite field arithmetic</Link>
            </div>
            <div style={{ textAlign: 'center', color: 'lightgreen' }}>
                Share
            </div>
            <div>
                secret ={' '}
                <textarea
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    rows={8}
                    cols={40}
                    style={{
                        backgroundColor: 'rgb(19, 22, 14)',
                        color: 'white',
                        fontFamily: 'monospace',
                        borderRadius: '2px',
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
                            fontFamily: 'monospace',
                            fontSize: '14px',
                        }}
                    >
                        {share}
                    </div>
                ))}
            </div>
            <div style={{ fontStyle: 'italic' }}>
                All the above shares are required to reconstruct the polynomials
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
                            placeholder={`Paste the share ${id + 1} here`}
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
                                fontFamily: 'monospace',
                                fontSize: '14px',
                            }}
                        />
                    ),
                )}
            </div>
            <button onClick={loadShares}>Load shares from previous step</button>
            <button
                onClick={reconstructSecret}
                disabled={
                    sharesToReconstruct.reduce((acc, share) => {
                        return share.length ? acc + 1 : acc;
                    }, 0) < numberOfSharesToReconstruct
                }
            >
                Reconstruct
            </button>
            <div style={{ marginTop: '16px' }}>Reconstructed secret: </div>
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
                    fontFamily: 'monospace',
                    borderRadius: '2px',
                    padding: '8px',
                    border: '1px solid rgb(46, 53, 35)',
                    margin: '8px',
                    boxSizing: 'border-box',
                }}
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
                    reconstructedSecret.split('\n').map((el, id) => (
                        <React.Fragment key={id}>
                            {el}
                            <br />
                        </React.Fragment>
                    ))
                )}
            </div>
        </div>
    );
};

export default FiniteFieldString;
