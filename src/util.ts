const maxN = 1000;

export function preparePolynomial(secret: number, numberOfShares: number) {
    const coefficients: number[] = [];
    let label = `f(x) = ${secret}`;
    for (let i = 0; i < numberOfShares; i++) {
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
        for (let i = 1; i <= numberOfShares; i++) {
            y += Math.pow(x, i) * coefficients[i - 1];
        }
        return y;
    }
    return { fn, label };
}
