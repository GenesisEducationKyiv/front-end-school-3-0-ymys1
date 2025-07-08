import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load pages
const TracksPage = lazy(() => import('./pages/tracksPage'));


export default function App() {
    return (
        <Routes>
            <Route path='/' element={<TracksPage />} />
        </Routes>
    );
}
