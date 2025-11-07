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
        let xAxisInterceptStep: number | null = null;
        let yAxisInterceptStep: number | null = null;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const steps = Math.max(canvas.width, canvas.height) * 3;
        const ys: number[] = [];
        const xs: number[] = [];
        let previousX: number = x1;
        let previousY: number = fn(x1);
        for (let i = 0; i < steps; i++) {
            const x = ((x2 - x1) / steps) * i + x1;
            const y = fn(x);
            ys.push(y);
            xs.push(x);
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
            if (xAxisInterceptStep == null) {
                if (previousX < 0 && x >= 0) {
                    xAxisInterceptStep = i;
                }
                previousX = x;
            }
            if (yAxisInterceptStep == null) {
                if ((previousY < 0 && y >= 0) || (previousY > 0 && y <= 0)) {
                    yAxisInterceptStep = i;
                }
                previousY = y;
            }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        if (xAxisInterceptStep != null) {
            ctx.beginPath();
            ctx.moveTo((xAxisInterceptStep / steps) * canvas.width, 0);
            ctx.lineTo(
                (xAxisInterceptStep / steps) * canvas.width,
                canvas.height,
            );
            ctx.closePath();
            ctx.stroke();
        }
        if (yAxisInterceptStep != null) {
            ctx.beginPath();
            ctx.moveTo(0, (yAxisInterceptStep / steps) * canvas.height);
            ctx.lineTo(
                canvas.width,
                (yAxisInterceptStep / steps) * canvas.height,
            );
            ctx.closePath();
            ctx.stroke();
        }
        ctx.fillStyle = 'rgb(158, 190, 128)';
        for (let i = 0; i < steps; i++) {
            const x = xs[i];
            const y = ys[i];
            ctx.fillRect(
                ((x - x1) / (x2 - x1)) * canvas.width,
                (1 - (y - yMin) / (yMax - yMin)) * canvas.height,
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
