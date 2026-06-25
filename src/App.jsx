import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./app/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />

        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;