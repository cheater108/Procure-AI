import { Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import { AppLayout } from '@/components/AppLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
