import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rooms from "./pages/Rooms";
import Chat from "./pages/Chat";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const { user } = useContext(AuthContext);

  return (
     <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/chat/:roomId" element={<Chat />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
