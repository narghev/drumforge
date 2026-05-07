import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ExercisePage } from './pages/ExercisePage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises/:id" element={<ExercisePage />} />
      </Routes>
    </BrowserRouter>
  );
}
