import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
