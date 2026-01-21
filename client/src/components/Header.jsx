import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => navigate("/rooms")}
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          ActiveRoom
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-600 hidden sm:block">
                Hi, <b>{user.name}</b>
              </span>

              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Admin
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/")}
                className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
