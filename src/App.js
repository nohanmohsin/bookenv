import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./dist/style.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Signup from "./components/userAuth/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import Signin from "./components/userAuth/Signin";
import ResetPass from "./components/userAuth/ResetPass";
import PdfRenderer from "./components/PdfRenderer/PdfRenderer";
import Upload from "./components/Upload/Upload";
import Explore from "./components/Explore/Explore";
import BookDetails from "./components/BookDetails/BookDetails";
import SearchPage from "./components/SearchPage/SearchPage";
import NotFound from "./components/NotFound/NotFound";
import Threads from "./components/Threads/Threads";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import MyLibrary from "./components/MyLibrary/MyLibrary";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/not-found"
              element={<NotFound errorName={"book"} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/reset-pass"
              element={
                <PrivateRoute>
                  <ResetPass />
                </PrivateRoute>
              }
            />
            {/* rendering two routes for page query because v6 doesn't support optional parameters */}
            <Route
              path="/view=:fileName/page=:jumpPageNumber"
              element={
                <PrivateRoute>
                  <PdfRenderer />
                </PrivateRoute>
              }
            />
            <Route
              path="/view=:fileName"
              element={
                <PrivateRoute>
                  <PdfRenderer />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-library"
              element={
                <PrivateRoute>
                  <MyLibrary />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <Upload />
                </PrivateRoute>
              }
            />
            <Route path="/explore" element={<Explore />} />
            <Route path="/:bookID" element={<BookDetails />} />
            <Route path="/search=:searchQuery" element={<SearchPage />} />
            <Route
              path="/threads/id=:threadID"
              element={
                <PrivateRoute>
                  <Threads />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
