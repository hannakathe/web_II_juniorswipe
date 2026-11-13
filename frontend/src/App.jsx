import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* cuando existan: */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="*" element={<p style={{ padding: 24 }}>404</p>} />
      </Routes>
    </BrowserRouter>
  );
}
