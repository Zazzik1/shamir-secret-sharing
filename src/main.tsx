import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import IntegerArithmeticPage from './pages/IntegerArithmetic';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FiniteFieldArithmetic from './pages/FiniteFieldArithmetic';
import FiniteFieldString from './pages/FiniteFieldString';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename="/shamir-secret-sharing">
            <Routes>
                <Route
                    path="/"
                    element={<IntegerArithmeticPage />}
                />
                <Route
                    path="/finite-field"
                    element={<FiniteFieldArithmetic />}
                />
                <Route
                    path="/finite-field-string"
                    element={<FiniteFieldString />}
                />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
