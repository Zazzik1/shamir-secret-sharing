const maxN = 1000;

/** f(x) */
export type FX = (x: number) => number;

export type Point = { x: number; y: number };

export function preparePolynomial(
    secret: number,
    numberOfShares: number,
): {
    fn: FX;
    label: string;
} {
    const coefficients: number[] = [];
    let label = `f(x) = ${secret}`;
    for (let i = 0; i < numberOfShares - 1; i++) {
        const coef = Math.round(Math.random() * maxN) - maxN / 2;
        coefficients.push(coef);
        if (coef > 0) {
            label += ` + ${coef}x^${i + 1}`;
        } else if (coef < 0) {
            label += ` - ${Math.abs(coef)}x^${i + 1}`;
        }
    }
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
