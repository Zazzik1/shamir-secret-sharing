import React from 'react';

const maxN = 1000;

/** f(x) */
export type FX = (x: number) => number;

export type Point = { x: number; y: number };

export function preparePolynomial(
    secret: number,
    numberOfShares: number,
): {
    fn: FX;
    label: React.ReactNode;
} {
    const coefficients: number[] = [];
    const labelParts: React.ReactNode[] = [`f(x) = ${secret}`];
    for (let i = 0; i < numberOfShares - 1; i++) {
        const coef = Math.round(Math.random() * maxN) - maxN / 2;
        coefficients.push(coef);
        if (coef > 0) {
            labelParts.push(` + ${coef}x`);
            if (i > 0) labelParts.push(<sup>{i + 1}</sup>);
        } else if (coef < 0) {
            labelParts.push(` - ${Math.abs(coef)}x`);
            if (i > 0) labelParts.push(<sup>{i + 1}</sup>);
        }
    }
    const label = (
        <>
            {labelParts.map((part, id) => (
                <React.Fragment key={id}>{part}</React.Fragment>
            ))}
        </>
    );
    function fn(x: number): number {
        let y = secret;
        for (let i = 1; i <= numberOfShares - 1; i++) {
            y += Math.pow(x, i) * coefficients[i - 1];
        }
        return y;
    }
    return { fn, label };
}

/**
 * Returns a polynomial that interpolates a given set of data.
 * https://en.wikipedia.org/wiki/Lagrange_polynomial
 */
export function lagrangeInterpolate(points: Point[]): FX {
    function fn(x: number) {
        let L = 0;
        for (let j = 0; j < points.length; j++) {
            let l = 1;
            for (let m = 0; m < points.length; m++) {
                if (j === m) continue;
                l *= (x - points[m].x) / (points[j].x - points[m].x);
            }
            L += points[j].y * l;
        }
        return L;
    }

    return fn;
}

export function lagrangeInterpolateMod(points: Point[], prime: number) {
    function fn(x: number): number {
        let L = 0;

        for (let j = 0; j < points.length; j++) {
            let l = 1;
            for (let m = 0; m < points.length; m++) {
                if (j === m) continue;
                const numerator = mod(x - points[m].x, prime);
                const denominator = mod(points[j].x - points[m].x, prime);
                const invDen = modInv(denominator, prime);
                l = mod(l * numerator * invDen, prime);
            }
            L = mod(L + points[j].y * l, prime);
        }

        return L;
    }

    return fn;
}

/**
 * This function returns a result of `a mod b`,
 * which is always a positive number.
 */
export function mod(a: number, b: number): number {
    return ((a % b) + b) % b;
}

/**
 * https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
 */
export function modInv(a: number, b: number): number {
    let t = 0;
    let newT = 1;
    let r = b;
    let newR = mod(a, b);

    while (newR !== 0) {
        const q = Math.floor(r / newR);
        [t, newT] = [newT, t - q * newT];
        [r, newR] = [newR, r - q * newR];
    }

    if (r > 1) throw new Error(`${a} does not have modInv ${b}`);
    if (t < 0) t += b;
    return t;
}

export function makeShares(
    secret: number,
    numberOfShares: number,
    prime: number,
): { shares: Point[]; polynomial: { fn: FX; label: React.ReactNode } } {
    const polynomial = preparePolynomial(secret, numberOfShares);
    const shares: Point[] = Array.from({ length: numberOfShares }, (_, id) => ({
        x: id + 1,
        y: mod(polynomial.fn(id + 1), prime),
    }));
    return {
        shares,
        polynomial: {
            fn: (x: number) => mod(polynomial.fn(x), prime),
            label: (
                <>
                    {polynomial.label} (mod {prime})
                </>
            ),
        },
    };
}

export function makeSharesStr(
    secret: string,
    numberOfShares: number,
    prime: number,
): string[] {
    const shares: Record<string, string[]> = {};
    for (let i = 0; i < secret.length; i++) {
        const { shares: s } = makeShares(
            secret.charCodeAt(i),
            numberOfShares,
            prime,
        );
        for (let j = 0; j < s.length; j++) {
            if (shares[j]) {
                shares[j].push(s[j].y.toString(36));
            } else {
                shares[j] = [
                    s[j].x.toString(36),
                    prime.toString(36),
                    s[j].y.toString(36),
                ];
            }
        }
    }
    return Object.values(shares).map((share) => share.join(':'));
}

export function getSecretFromSharesStr(sharesStr: string[]): string {
    const shares: number[][] = sharesStr.map((share) =>
        share.split(':').map((str) => Number.parseInt(str, 36)),
    );
    const prime = shares[0][1];
    const secret: string[] = [];
    for (let j = 2; j < shares[0].length; j++) {
        const points: Point[] = [];
        for (let i = 0; i < shares.length; i++) {
            points.push({
                x: shares[i][0],
                y: shares[i][j],
            });
        }
        const poly = lagrangeInterpolateMod(points, prime);
        secret.push(String.fromCharCode(poly(0)));
    }
    return secret.join('');
}

export function getShareMetadata(share: string): {
    x: number;
    prime: number;
} {
    const colonIndex1st = share.indexOf(':');
    const colonIndex2nd = share.indexOf(':', colonIndex1st + 1);
    return {
        x: Number.parseInt(share.slice(0, colonIndex1st), 36),
        prime: Number.parseInt(
            share.slice(colonIndex1st + 1, colonIndex2nd),
            36,
        ),
    };
}

export function validateSharesStr(shares: string[]): void {
    const xs = new Set<number>();
    const { prime, x } = getShareMetadata(shares[0]);
    xs.add(x);
    for (let i = 1; i < shares.length; i++) {
        const { prime: primei, x: xi } = getShareMetadata(shares[i]);

        if (xs.has(xi)) {
            throw new Error(
                `Two shares have the same x value (x=${x}). Each share must have a unique first segment.`,
            );
        }
        if (prime !== primei) {
            throw new Error(
                `Share ${
                    i + 1
                } was generated with a different prime than share ${i} (${prime} vs ${primei}). This is likely an error - all shares must have the same second segment.`,
            );
        }
        xs.add(x);
    }
}
