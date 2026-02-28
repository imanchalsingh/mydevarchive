import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/AdminAuth/LoginPage";
import Dashboard from "./pages/MyDevArchive";
import ProtectedRoute from "./routes/protectedRoute";
import { AuthProvider } from "./context/authContext";
import UserDashboard from "./components/User/UserDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserDashboard/>} />
          <Route path="/admin" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
