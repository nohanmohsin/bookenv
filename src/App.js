import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./dist/style.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Signup from "./components/userAuth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route exact path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
