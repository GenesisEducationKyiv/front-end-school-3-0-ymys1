import { Routes, Route } from 'react-router-dom';
import TracksPage from './pages/tracksPage';

export default function App() {
    return (
        <Routes>
            <Route path='/' element={<TracksPage />} />
        </Routes>
    );
}
