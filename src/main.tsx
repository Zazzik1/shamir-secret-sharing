import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import IntegerArithmeticPage from './pages/IntegerArithmetic';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FiniteFieldArithmetic from './pages/FiniteFieldArithmetic';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<IntegerArithmeticPage />}
                />
                <Route
                    path="/finite-field"
                    element={<FiniteFieldArithmetic />}
                />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
