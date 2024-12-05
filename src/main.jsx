import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AnimeCatalog from './AnimeCatalog.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnimeCatalog />
  </StrictMode>,
)
