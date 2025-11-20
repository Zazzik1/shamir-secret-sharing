import { useEffect, useRef, useState } from 'react';
import {
    BORDER_COLOR,
    CARD_BACKGROUND_COLOR_LIGHTER,
    HEADING_TEXT_COLOR,
    INPUT_TEXT_COLOR,
} from './shared';
import styled from '@emotion/styled';

type Props = {
    fn: (x: number) => number;
    x1: number;
    x2: number;
};

const CanvasWrapper = styled.div`
    position: relative;
    > canvas {
        border: 1px solid ${BORDER_COLOR};
        max-width: 100%;

        &:last-child {
            position: absolute;
            left: 0;
            top: 0;
        }
    }
    > div {
        position: absolute;
        left: 0;
        top: 0;
        background-color: ${CARD_BACKGROUND_COLOR_LIGHTER};
        border: 1px solid ${BORDER_COLOR};
        padding: 8px 10px;
        border-radius: 2px;
        white-space: nowrap;
        z-index: 1;
        pointer-events: none;
    }
`;

type Box = {
    isVisible: boolean;
    x: string;
    y: string;
    canvasX: number;
    canvasY: number;
    flipX: boolean;
    flipY: boolean;
};

const Plot = ({ fn, x1, x2 }: Props) => {
    const [box, setBox] = useState<Box>({
        isVisible: false,
        x: (0).toFixed(3),
        y: (0).toFixed(3),
        canvasX: 0,
        canvasY: 0,
        flipX: false,
        flipY: false,
    });
    const ref = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const overlayCanvas = overlayRef.current;
        if (!canvas) return;
        if (!overlayCanvas) return;
        const ctx = canvas.getContext('2d');
        const overlayCtx = overlayCanvas.getContext('2d');
        if (!ctx) return;
        if (!overlayCtx) return;
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
        ctx.strokeStyle = BORDER_COLOR;
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
            const x = (yAxisInterceptStep / steps) * (x2 - x1) + x1;
            const y = fn(x);
            const yCanvas = (1 - (y - yMin) / (yMax - yMin)) * canvas.height;
            ctx.moveTo(0, yCanvas);
            ctx.lineTo(canvas.width, yCanvas);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.fillStyle = INPUT_TEXT_COLOR;
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

        const handleMouseLeave = () => {
            overlayCtx.clearRect(
                0,
                0,
                overlayCanvas.width,
                overlayCanvas.height,
            );
            setBox((old) => ({ ...old, isVisible: false }));
        };
        const handleMouseMove = (e: MouseEvent) => {
            const canvasXNormalized = e.offsetX / canvas.clientWidth; // 0-1
            // canvas.clientWidth is a real width, not just the pixel count (plots are squeezed on mobile devices)
            const x = canvasXNormalized * (x2 - x1) + x1;
            const y = fn(x);
            const canvasYNormalized = (y - yMin) / (yMax - yMin); // 0-1; calculated per value from f(x), not for Y mouse position on the chart!
            const canvasY = canvas.height - canvasYNormalized * canvas.height;
            overlayCtx.clearRect(
                0,
                0,
                overlayCanvas.width,
                overlayCanvas.height,
            );
            overlayCtx.fillStyle = HEADING_TEXT_COLOR;
            overlayCtx.beginPath();
            for (let y = 0; y < canvas.height; y += 6) {
                overlayCtx.fillRect(canvasXNormalized * canvas.width, y, 1, 1);
            }
            overlayCtx.closePath();
            overlayCtx.stroke();
            overlayCtx.strokeStyle = INPUT_TEXT_COLOR;
            overlayCtx.fillStyle = INPUT_TEXT_COLOR;
            overlayCtx.beginPath();
            overlayCtx.arc(
                canvasXNormalized * canvas.width,
                canvasY,
                6,
                0,
                2 * Math.PI,
            );
            overlayCtx.fill();
            overlayCtx.stroke();
            const boxEl = boxRef.current;
            const boxWidth = boxEl?.clientWidth || 100;
            const boxHeight = boxEl?.clientHeight || 100;
            const flipX = e.offsetX + boxWidth >= canvas.clientWidth;
            const flipY = canvasY + boxHeight >= canvas.clientHeight;
            setBox((old) => ({
                ...old,
                isVisible: true,
                x: x.toFixed(3),
                y: y.toFixed(3),
                canvasY:
                    canvas.clientHeight -
                    canvasYNormalized * canvas.clientHeight,
                canvasX: e.offsetX,
                flipX,
                flipY,
            }));
        };
        overlayCanvas.addEventListener('mouseleave', handleMouseLeave);
        overlayCanvas.addEventListener('mousemove', handleMouseMove);
        return () => {
            overlayCanvas.removeEventListener('mouseleave', handleMouseLeave);
            overlayCanvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [x1, x2, fn]);

    return (
        <CanvasWrapper>
            <div
                ref={boxRef}
                style={{
                    left: `${box.canvasX}px`,
                    top: `${box.canvasY}px`,
                    transform: `translate(${box.flipX ? '-100%' : '0%'}, ${
                        box.flipY ? '-100%' : '0%'
                    })`,
                    display: box.isVisible ? 'block' : 'none',
                }}
            >
                <div>x: {box.x}</div>
                <div>y: {box.y}</div>
            </div>

            <canvas
                width={500}
                height={500}
                ref={ref}
            ></canvas>
            <canvas
                width={500}
                height={500}
                ref={overlayRef}
            ></canvas>
        </CanvasWrapper>
    );
};

export default Plot;
