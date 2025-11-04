import { useState } from 'react';
import Plot from './components/Plot';

function App() {
    const [range, setRange] = useState<{ x1: number; x2: number }>({
        x1: -2,
        x2: 2,
    });
    return (
        <>
            <Plot
                fn={(x) => Math.pow(x, 3) + 2 * Math.pow(x, 2) - 3 * x}
                x1={range.x1}
                x2={range.x2}
            />
            <div style={{ marginTop: '16px' }}>
                x1, x2&nbsp;
                <input
                    type="number"
                    value={range.x1}
                    step="0.2"
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (value >= range.x2) return;
                        setRange((old) => ({
                            ...old,
                            x1: value,
                        }));
                    }}
                />
                <input
                    type="number"
                    value={range.x2}
                    step="0.2"
                    onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        if (value <= range.x1) return;
                        setRange((old) => ({
                            ...old,
                            x2: value,
                        }));
                    }}
                />
            </div>
        </>
    );
}

export default App;
