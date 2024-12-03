import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutListing from "./ui/screens/Layout/LayoutListing";
import LayoutForm from "./ui/screens/Layout/LayoutForm";
import LayoutUpdate from "./ui/screens/Layout/LayoutUpdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<LayoutListing />} />
        <Route path="/form" element={<LayoutForm />} />
        <Route path="/update/:id_student" element={<LayoutUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;
