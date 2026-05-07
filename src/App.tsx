import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

// Lazy-load the exercise page so alphaTab (~1.1 MB worker + ~400 KB main)
// only ships when the user actually opens an exercise. The home page
// stays light: just React, the router, and our own UI.
const ExercisePage = lazy(() =>
  import('./pages/ExercisePage').then((m) => ({ default: m.ExercisePage })),
);

function ExerciseLoading() {
  return (
    <div className="flex h-screen items-center justify-center text-sm text-gray-500 dark:text-gray-400">
      Loading…
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/exercises/:id"
          element={
            <Suspense fallback={<ExerciseLoading />}>
              <ExercisePage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
