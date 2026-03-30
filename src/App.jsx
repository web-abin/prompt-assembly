import { HashRouter, Routes, Route, useParams } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Mall from './pages/Mall'
import Landing from './pages/Landing'
import About from './pages/About'
import BatchResize from './pages/BatchResize'
import SequenceFrame from './pages/SequenceFrame'
import Spritesheet from './pages/Spritesheet'
import './App.css'

function DetailRoute() {
  const { id } = useParams()
  return <Detail key={id} />
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/batch-resize" element={<BatchResize />} />
            <Route path="/sequence-frame" element={<SequenceFrame />} />
            <Route path="/spritesheet" element={<Spritesheet />} />
            <Route path="/prompts" element={<Home />} />
            <Route path="/mall" element={<Mall />} />
            <Route path="/template/:id" element={<DetailRoute />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
