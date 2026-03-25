import { HashRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import './App.css'

function DetailRoute() {
  const { id } = useParams()
  return <Detail key={id} />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template/:id" element={<DetailRoute />} />
      </Routes>
    </HashRouter>
  )
}
