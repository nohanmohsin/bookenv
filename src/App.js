import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./dist/style.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Signup from "./components/userAuth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import Signin from "./components/userAuth/Signin";
import ResetPass from "./components/userAuth/ResetPass";
import PdfRenderer from "./scss/components/PdfRenderer/PdfRenderer";
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path='/reset-pass' element={<ResetPass />} />
            <Route path='/view' element={<PdfRenderer />}/>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
