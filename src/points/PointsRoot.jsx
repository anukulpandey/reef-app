import React from "react";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AppRoutes from "./routes/index.jsx";
import "./index.css";

export default function PointsRoot() {
  return (
    <div id="points-root">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}


