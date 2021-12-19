import React, { useState, useEffect } from "react";
import Navigation from "./components/navigation.component.jsx";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/home.page";
import AdminPage from "./pages/admin.page";
import LoginPage from "./pages/login.page";
import LostAndFoundPage from "./pages/lostfound.page";
import PageNotFoundPage from "./pages/pagenotfound.page";
import { FaAtom } from "react-icons/fa";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/user/login")
      .then(() => {
        setLoading(false);
        setIsAdmin(true);
      })
      .catch((error) => {
        setLoading(false);
        setIsAdmin(false);
      });
  }, []);

  return loading ? (
    <div className="w-full h-screen flex justify-center items-center bg-main">
      <FaAtom size={70} className="spinner text-white" />
    </div>
  ) : (
    <BrowserRouter>
      <div className="flex h-screen bg-main">
        {isAdmin && <Navigation />}
        <div className={isAdmin && "pages"}>
          <Routes>
            <Route exact path="Login" element={<LoginPage />} />
            <Route
              exact
              path="/"
              element={isAdmin ? <HomePage /> : <Navigate to="/Login" />}
            />
            <Route
              exact
              path="Home"
              element={isAdmin ? <HomePage /> : <Navigate to="/Login" />}
            />
            <Route
              exact
              path="Admin"
              element={isAdmin ? <AdminPage /> : <Navigate to="/Login" />}
            />
            <Route
              exact
              path="LostAndFound"
              element={
                isAdmin ? <LostAndFoundPage /> : <Navigate to="/Login" />
              }
            />
            {!isAdmin && <Route exact path="Login" element={<LoginPage />} />}

            <Route path="*" element={<PageNotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
