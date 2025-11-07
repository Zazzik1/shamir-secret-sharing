import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import IntegerArithmeticPage from './pages/IntegerArithmetic';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <IntegerArithmeticPage />
    </StrictMode>,
);
