import { lazy, Suspense } from 'react'
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
import RemoveBackground from './pages/RemoveBackground'
import EmbeddedHtmlTool from './components/EmbeddedHtmlTool'
import './App.css'

const GifTool = lazy(() => import('./pages/GifTool'))
const ImageCompress = lazy(() => import('./pages/ImageCompress'))

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
            <Route path="/remove-background" element={<RemoveBackground />} />
            <Route path="/sequence-frame" element={<SequenceFrame />} />
            <Route path="/spritesheet" element={<Spritesheet />} />
            <Route
              path="/img-to-spritesheet"
              element={
                <EmbeddedHtmlTool
                  title="精灵图采集"
                  htmlFile="img-to-spritesheet.html"
                  iframeTitle="精灵图智能提取与挑选"
                />
              }
            />
            <Route
              path="/smart-cutout"
              element={
                <EmbeddedHtmlTool
                  title="智能抠图（透明背景）"
                  htmlFile="智能抠图(透明背景).html"
                  iframeTitle="智能抠图（透明背景）"
                />
              }
            />
            <Route
              path="/audio-trim"
              element={
                <EmbeddedHtmlTool
                  title="截取音频"
                  htmlFile="截取音频.html"
                  iframeTitle="截取音频"
                />
              }
            />
            <Route
              path="/gif-tool"
              element={
                <Suspense fallback={<div className="route-suspense-fallback">加载中…</div>}>
                  <GifTool />
                </Suspense>
              }
            />
            <Route
              path="/image-compress"
              element={
                <Suspense fallback={<div className="route-suspense-fallback">加载中…</div>}>
                  <ImageCompress />
                </Suspense>
              }
            />
            <Route path="/prompts" element={<Home />} />
            <Route path="/mall" element={<Mall />} />
            <Route path="/template/:id" element={<DetailRoute />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
