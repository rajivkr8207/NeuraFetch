import { Routes, Route } from "react-router-dom";
import Profile from "../features/auth/pages/Profile";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";


export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route
        path="/login"
        element={
            <Login />
        }
      />

      <Route
        path="/register"
        element={
            <Register />
        }
      />

      {/* Common */}
      {/* <Route path="/" element={<Home />} /> */}

      {/* Protected */}
      <Route
        path="/profile"
        element={
            <Profile />
        }
      />

      {/* 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />

    </Routes>
  );
}