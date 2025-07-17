import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import PrivateRoute from "./components/PrivateRoute";
import NewsTimeCapsule from "./pages/NewsTimeCapsule";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/simulator"
          element={
            <PrivateRoute>
              <Simulator />
            </PrivateRoute>
          }
        />
        <Route
          path="/newstimecapsule"
          element={
            <PrivateRoute>
              <NewsTimeCapsule />
            </PrivateRoute>
          }
        />

        <Route path="/feedback" element={<Feedback />} /> {/* Add this line */}

        {/* Default Redirect */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
