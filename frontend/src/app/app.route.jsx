import { Routes, Route } from "react-router-dom";
import Profile from "../features/auth/pages/Profile";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/home/pages/Home";
import Protected from "../features/auth/components/Protected";
import ChangePassword from "../features/auth/pages/ChangePassword";
import ExtensionGuide from "../features/home/pages/ExtensionGuide";


export default function AppRoutes() {
  return (
    <Routes>

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

      <Route path="/" element={
        <Protected>
          <Dashboard />
        </Protected>
      } />

      <Route
        path="/profile"
        element={
          <Protected>
            <Profile />
          </Protected>
        }
      />
      <Route
        path="/change/password"
        element={
          <Protected>
            <ChangePassword />
          </Protected>
        }
      />

      <Route path="*" element={<div>Page Not Found</div>} />

      <Route path="/extension-guide" element={<ExtensionGuide />} />

    </Routes>
  );
}