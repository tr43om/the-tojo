import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages and components
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Login } from "./pages/login/Login";
import { Signup } from "./pages/signup/Signup";
import { Project } from "./pages/project/Project";
import { Create } from "./pages/create/Create";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { useAuthContext } from "./hooks/useAuthContext";
import { OnlineUsers } from "./components/OnlineUsers";
import { useUnload } from "./hooks/useUnload";
import { useFirestore } from "./hooks/useFirestore";

import { useEffect } from "react";

// rtdb
import { auth, rtdb } from "./firebase/config";
import { ref, set, onDisconnect, onValue } from "firebase/database";

function App() {
  const { user, authIsReady } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/create"
                element={user ? <Create /> : <Navigate to="/login" />}
              />
              <Route
                path="/projects/:id"
                element={user ? <Project /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/signup"
                element={user ? <Navigate to="/" /> : <Signup />}
              />
            </Routes>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
