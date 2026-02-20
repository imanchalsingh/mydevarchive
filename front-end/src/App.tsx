import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/LoginPage";
import Dashboard from "./pages/MyDevArchive";
import ProtectedRoute from "./routes/protectedRoute";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
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
