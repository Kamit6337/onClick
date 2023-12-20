import { Routes, Route } from "react-router-dom";
import ErrorPage from "../pages/error/ErrorPage";
import Admin from "../pages/admin/Admin";
import AdminLayout from "../layouts/AdminLayout";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import LoginCheck from "../pages/auth/LoginCheck";
import Home from "../pages/home/Home";

const Router = () => {
  return (
    <Routes>
      {/* NOTE: HOME ROUTES */}
      <Route path="/admin" element={<RootLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* NOTE: AUTH ROUTES */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/check" element={<LoginCheck />} />

      {/* NOTE: PROTECTED ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
      </Route>

      {/* NOTE: ERROR ROUTE */}
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
