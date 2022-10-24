import { Routes, Route, BrowserRouter } from "react-router-dom";
import './assets/css/App.css';
import Header from "./components/Header";
import Detail from "./pages/Detail";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/activity/:id" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;