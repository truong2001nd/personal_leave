import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./views/Auth";
import Landing from "./components/layout/Landing";
import AuthContextProvider from "./contexts/AuthContext.js";
import Home from "./views/Home.js";
// import ProtectedRoute from "./components/routing/ProtectedRoute.js";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth authRoute="login" />} />
          {/* <Route path="/home" element={<ProtectedRoute element={Home} />} /> */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
