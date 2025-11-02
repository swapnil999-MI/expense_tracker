import { Routes, Route } from "react-router-dom"
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            {/* Future routes go here */}
          </Route>
        </Routes>
  )
}

export default App
