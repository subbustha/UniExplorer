import React, { useState, useEffect } from "react";
import Navigation from "./components/navigation.component.jsx";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home.page";
import AdminPage from "./pages/admin.page";
import LoginPage from "./pages/login.page";
import LostAndFoundPage from "./pages/lostfound.page";
import PageNotFoundPage from "./pages/pagenotfound.page";
import Authenticator from "./routes/admin-auth";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    Authenticator((result) => setIsAdmin(result));
  }, []);

  return isAdmin ? <AuthenticatedComponent /> : <LoginPage />;
};

const AuthenticatedComponent = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-main">
        <Navigation />
        <div className="pages">
          <Routes>
            <Route exact path="/" element={<Navigate to="/Home" />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/Admin" element={<AdminPage />} />
            <Route path="/LostAndFound" element={<LostAndFoundPage />} />
            <Route path="/Login" element={<Navigate to="/Home" />} />
            <Route path="*" element={<PageNotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
