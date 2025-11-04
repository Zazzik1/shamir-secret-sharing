import { useEffect, useRef } from 'react';

type Props = {
    fn: (x: number) => number;
    x1: number;
    x2: number;
};

const Plot = ({ fn, x1, x2 }: Props) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let yMin = Number.POSITIVE_INFINITY;
        let yMax = Number.NEGATIVE_INFINITY;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        const steps = Math.max(canvas.width, canvas.height) * 3;
        const ys: number[] = [];
        const xs: number[] = [];
        for (let i = 0; i < steps; i++) {
            const x = ((x2 - x1) / steps) * i + x1;
            const y = fn(x);
            ys.push(y);
            xs.push(x);
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
        }
        for (let i = 0; i < steps; i++) {
            const x = xs[i];
            const y = ys[i];
            ctx.fillRect(
                ((x - x1) / (x2 - x1)) * canvas.width,
                ((y - yMin) / (yMax - yMin)) * canvas.height,
                1,
                1,
            );
        }
        console.log({ yMax, yMin, x1, x2 });
    }, [x1, x2, fn]);

    return (
        <canvas
            style={{ border: '1px solid rgb(59, 32, 32)' }}
            width={600}
            height={600}
            ref={ref}
        >
            Plot
        </canvas>
    );
};

export default Plot;
