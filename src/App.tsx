import Plot from './components/Plot';

function App() {
    return (
        <>
            <Plot
                fn={(x) => Math.pow(x, 3) + 2 * Math.pow(x, 2) - 3 * x}
                x1={-2}
                x2={2}
            />
        </>
    );
}

export default App;
